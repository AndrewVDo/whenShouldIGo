from flask import Flask, request, abort
from flask_cors import CORS
import pymongo
from bson.json_util import dumps
from bson.json_util import loads
import os
import requests
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

mongoPW = os.getenv('MONGO_PW')
mongoClient = pymongo.MongoClient(
    f'mongodb+srv://Andrew:{mongoPW}@cluster0.dcy2n.mongodb.net/?retryWrites=true&w=majority')
mongoDatabase = mongoClient.airport_database
mongoCollection = mongoDatabase.airport_collection


@app.route('/countries', methods=["GET"])
def queryCountries():
    url = "https://ajayakv-rest-countries-v1.p.rapidapi.com/rest/v1/all"
    headers = {
        'x-rapidapi-key': os.getenv('RAPID_KEY'),
        'x-rapidapi-host': "ajayakv-rest-countries-v1.p.rapidapi.com"
    }
    response = requests.request("GET", url, headers=headers)
    if response.status_code != 200:
        abort(503, 'Rest-Countries not reachable')
    return dumps(response.json())


@app.route('/airports', methods=["GET"])
def queryAirports():
    iso_country = request.args['iso_country']
    if len(iso_country) != 2:
        abort(400, 'Incorrect request format')
    try:
        airportCursor = mongoCollection.find({'iso_country': iso_country})
    except:
        abort(503, 'MongoDB not reachable')
    return dumps(airportCursor)


@app.route('/when')
def when():
    timeFrame = request.args.get('timeFrame')
    destination = request.args.get('destination')
    departure = request.args.get('departure')
    return 'got it!'


def queryClimate(timeFrame, destination):
    return 'sunny down under'


def queryCurrency(timeFrame, destination, departure):
    return 'expensive'


def queryFlights(timeFrame, destination, departure):
    return '1000$'


def queryHotels(timeFrame, destination):
    return '100$/night'


if __name__ == "__main__":
    app.run()
