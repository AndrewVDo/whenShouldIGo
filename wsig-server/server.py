from flask import Flask, request, abort
from flask_cors import CORS
import pymongo
from meteostat import Stations, Daily
from bson.json_util import dumps
from bson.json_util import loads
from enum import Enum
import os
import requests
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()
app = Flask(__name__)
CORS(app)

mongoPW = os.getenv('MONGO_PW')
fixerKey = os.getenv('FIXER_KEY')
rapidKey = os.getenv('RAPID_KEY')

mongoClient = pymongo.MongoClient(
    f'mongodb+srv://Andrew:{mongoPW}@cluster0.dcy2n.mongodb.net/?retryWrites=true&w=majority')
airportDB = mongoClient.airport_database
currencyDB = mongoClient.currency_database


@app.route('/countries', methods=["GET"])
def countries():
    url = "https://ajayakv-rest-countries-v1.p.rapidapi.com/rest/v1/all"
    headers = {
        'x-rapidapi-key': rapidKey,
        'x-rapidapi-host': "ajayakv-rest-countries-v1.p.rapidapi.com"
    }
    response = requests.request("GET", url, headers=headers)
    if response.status_code != 200:
        abort(502, 'rest-countries api not reachable')
    return dumps(response.json())


@app.route('/airports', methods=["GET"])
def airports():
    country = request.args['iso_country']
    if not country or len(country) != 2:
        abort(400, 'Incorrect request format')
    try:
        airportCursor = airportDB.airport_collection.find(
            {'iso_country': country})
    except:
        abort(503, 'MongoDB not reachable')
    return dumps(airportCursor)


@app.route('/when', methods=["GET"])
def when():
    departureCountry = request.args.get('departureCountry')
    if not departureCountry or len(departureCountry) != 2:
        abort(400, 'invalid departure country')

    destinationCountry = request.args.get('destinationCountry')
    if not destinationCountry or len(destinationCountry) != 2:
        abort(400, 'invalid destination country')

    departureAirport = request.args.get('departureAirport')
    if not departureAirport or len(departureAirport) != 3:
        abort(400, 'invalid departure airport')

    destinationAirport = request.args.get('destinationAirport')
    if not destinationAirport or len(destinationAirport) != 3:
        abort(400, 'invalid destination airport')

    temperature = int(request.args.get('temperature'))
    if temperature < 0 or temperature > 5:
        abort(400, 'invalid temperature request')

    weather = int(request.args.get('weather'))
    if weather < 0 or weather > 2:
        abort(400, 'invalid weather request')

    departure = {
        'airport': departureAirport,
        'country': departureCountry
    }
    destination = {
        'airport': destinationAirport,
        'country': destinationCountry
    }
    climate = {
        'temperature': temperature,
        'weather': weather
    }

    currDates, currHist = queryCurrency(destination, departure)
    stations, stationData = queryClimate(destination, climate)
    flightDates, flightPrices = queryFlights(destination, departure)

    return dumps({
        'currDates'     : currDates,
        'currHist'      : currHist,
        
        'stations'      : stations,
        'stationData'   : stationData,

        'flightDates'   : flightDates,
        'flightPrices'  : flightPrices,

        'dstCurr'       : destination['currency'],
        'dstCtry'       : destination['country'],
        'dstAprt'       : destination['airport'],

        'dptCurr'       : departure['currency'],
        'dptCtry'       : departure['country'],
        'dptAprt'       : departure['airport']
    })


def getLatLongCity(destination):
    assert type(destination) == str and len(destination) == 3
    try:
        response = airportDB.airport_collection.find_one(
            {'iata_code': destination})
        reqFields = ['latitude', 'longitude', 'municipality']
        if not response or not all(attr in response for attr in reqFields):
            abort(
                404, f'Location info not found for airport IATA code {destination}')
        return float(response['latitude']), float(response['longitude']), response['municipality']
    except:
        abort(503, "MongoDB not reachable")


def getDatePoints(months):
    def lastMonth(tPoint):
        if tPoint.month == 1:
            return datetime(tPoint.year-1, 12, 1)
        return datetime(tPoint.year, tPoint.month-1, 1)

    def nextMonth(tPoint):
        if tPoint.month == 12:
            return datetime(tPoint.year+1, 1, 1)
        return datetime(tPoint.year, tPoint.month+1, 1)

    tPoints = [datetime.today()]
    for m in range(abs(months)):
        if months > 0:
            tPoints.append(nextMonth(tPoints[m]))
        else:
            tPoints.append(lastMonth(tPoints[m]))
    return tPoints


def queryClimate(destination, climate):
    assert 'airport' in destination and len(destination['airport']) == 3

    (lat, lon, _) = getLatLongCity(destination['airport'])
    stations = Stations()
    stations = stations.nearby(lat, lon)

    datePoints = getDatePoints(-12)
    lastYear = datePoints[-1]
    today = datePoints[0]

    stationData = []
    for station in stations.fetch(3):
        climateData = Daily(station, start=lastYear, end=today)
        climateData = climateData.fetch()

    return stations, stationData


def getCurrencyName(countryCode):
    assert type(countryCode) == str and len(countryCode) == 2
    try:
        response = currencyDB.currency_map.find_one(
            {'country': countryCode})
        if not response or 'currency' not in response:
            abort(404, f"Currency for {countryCode} not found")
        return response['currency']
    except:
        abort(503, "MongoDB not reachable")


def getCachedCurrencyRate(date):
    assert type(date) == str
    try:
        return currencyDB.currency_history.find_one({"date": date})
    except:
        abort(503, "MongoDB not reachable")


def cacheCurrencyRate(fixerRsp):
    assert 'rates' in fixerRsp and 'date' in fixerRsp
    try:
        currencyDB.currency_history.insert_one(fixerRsp)
    except:
        abort(503, "MongoDB not reachable")


def getCurrencyRatesFromAPI(dateString):
    url = f"http://data.fixer.io/api/{dateString}?access_key={fixerKey}"
    response = requests.request("GET", url)
    if response.status_code != 200:
        abort(502, 'rest-currency api not reachable')
    return response.json()


def getCurrencyHistory(destinationCurrency, departureCurrency):
    assert type(departureCurrency) == str and type(destinationCurrency) == str
    assert 3 == len(departureCurrency) == len(destinationCurrency)
    currHist = []
    currDates = list(map(lambda date: date.strftime('%Y-%m-%d'), getDatePoints(-24)))

    for date in currDates:
        histRate = getCachedCurrencyRate(date)
        if histRate:
            if 'rates' not in histRate:
                abort(404, f'Currency rates missing on {date}')
            rates = histRate['rates']
        else:
            histRate = getCurrencyRatesFromAPI(date)
            if 'rates' not in histRate:
                abort(404, f'Currency rates missing on {date}')
            if 'date' not in histRate:
                abort(404, f'date missing for {date}')
            rates = histRate['rates']
            cacheCurrencyRate(histRate)

        if departureCurrency not in rates or float(rates[departureCurrency]) == 0.0:
            abort(
                404, f'Missing or invalid currency data for {departureCurrency} on {date}')
        if destinationCurrency not in rates or float(rates[destinationCurrency]) == 0.0:
            abort(
                404, f'Missing or invalid currency data for {destinationCurrency} on {date}')
        currHist.append(float(rates[destinationCurrency]) / float(rates[departureCurrency]))

    currDates[:] = [x[:7] for x in currDates]
    return currDates, currHist


def queryCurrency(destination, departure):
    assert 'country' in destination and len(destination['country']) == 2
    assert 'country' in departure and len(departure['country']) == 2

    destination['currency'] = getCurrencyName(destination['country'])
    departure['currency'] = getCurrencyName(departure['country'])
    currDates, currHist = getCurrencyHistory(
        destination['currency'], departure['currency'])

    return currDates, currHist


def getFlightQuotes(destination, departure, date="anytime"):
    url = f"https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/{departure['country']}/{departure['currency']}/en-{departure['country']}/{departure['airport']}-sky/{destination['airport']}-sky/{date}"
    headers = {
        'x-rapidapi-key': rapidKey,
        'x-rapidapi-host': "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
    }
    response = requests.request("GET", url, headers=headers)
    if response.status_code != 200:
        abort(502, 'rest-skyscanner api not reachable')
    return response.json()['Quotes']


def queryFlights(destination, departure):
    flightDates = []
    flightPrices = []

    for yearMonth in list(map(lambda date: date.strftime('%Y-%m'), getDatePoints(12))):
        for quote in getFlightQuotes(destination, departure, yearMonth):
            flightPrices.append(quote['MinPrice'])
            flightDates.append(quote['OutBoundLeg']['DepartureDate'])
    
    return flightDates, flightPrices


if __name__ == "__main__":
    app.run()
