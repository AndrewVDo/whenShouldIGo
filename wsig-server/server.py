from flask import Flask, request, abort
from flask_cors import CORS
import pymongo
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


class TemperatureEnum(Enum):
    none = 0
    freezing = 1
    cold = 2
    cool = 3
    warm = 4
    hot = 5


class WeatherEnum(Enum):
    none = 0
    snowy = 1
    rainy = 2
    cloudy = 3
    sunny = 4


@app.route('/countries', methods=["GET"])
def countries():
    url = "https://ajayakv-rest-countries-v1.p.rapidapi.com/rest/v1/all"
    headers = {
        'x-rapidapi-key': rapidKey,
        'x-rapidapi-host': "ajayakv-rest-countries-v1.p.rapidapi.com"
    }
    response = requests.request("GET", url, headers)
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
        abort(502, 'MongoDB not reachable')
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

    temperature = TemperatureEnum(int(request.args.get('temperature')))
    if not temperature:
        abort(400, 'invalid temperature request')

    weather = WeatherEnum(int(request.args.get('weather')))
    if not weather:
        abort(400, 'invalid weather request')

    histRates = queryCurrency(destinationCountry, departureCountry)

    return '\n'.join(str(p[0]) + '/' + str(p[1]) for p in histRates)


def queryClimate(destination):
    return 'sunny down under'


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


def lastMonths(monthsBack=24):
    def lastMonth(tPoint):
        if tPoint.month == 1:
            return datetime(tPoint.year-1, 12, 1)
        return datetime(tPoint.year, tPoint.month-1, 1)

    today = datetime.today()
    tPoints = [datetime.today()]
    for m in range(monthsBack):
        tPoints.append(lastMonth(tPoints[m]))
    return list(map(lambda date: date.strftime('%Y-%m-%d'), tPoints))


def getCurrencyRatesFromAPI(dateString):
    url = f"http://data.fixer.io/api/{dateString}?access_key={fixerKey}"
    response = requests.request("GET", url)
    if response.status_code != 200:
        abort(502, 'rest-countries api not reachable')
    return response.json()


def getCurrencyHistory(destinationCurrency, departureCurrency):
    assert type(departureCurrency) == str and type(destinationCurrency) == str
    assert 3 == len(departureCurrency) == len(destinationCurrency)
    currHist = []
    for date in lastMonths(3):
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
        currHist.append(
            (float(rates[destinationCurrency]), float(rates[destinationCurrency])))
    return currHist


def queryCurrency(destination, departure):
    assert destination and len(destination) == 2
    assert departure or len(departure) == 2

    destinationCurrency = getCurrencyName(destination)
    departureCurrency = getCurrencyName(departure)
    currHist = getCurrencyHistory(destinationCurrency, departureCurrency)

    return currHist


def queryFlights(destination, departure):
    return '1000$'


def queryHotels(destination):
    return '100$/night'


if __name__ == "__main__":
    app.run()
