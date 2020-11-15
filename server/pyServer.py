from optparse import OptionParser
from flask import Flask, request, abort
from flask_cors import CORS
import pymongo
from bson.json_util import dumps
from bson.json_util import loads

app = Flask(__name__)
CORS(app)

mongoCollection = None


@app.route('/')
def index():
    print("Hello")
    return 'hello world'


@app.route('/airports', methods=["GET"])
def getAirports():
    iso_country = request.args['iso_country']
    if len(iso_country) != 2:
        abort(400, 'Incorrect request format')
    airportCursor = mongoCollection.find({'iso_country': iso_country})
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
    parser = OptionParser()
    parser.add_option("--password", dest="mongoPassword")
    options, args = parser.parse_args()

    if not options.mongoPassword:
        parser.error('mongoPassword not given')

    mongoClient = pymongo.MongoClient(
        f'mongodb+srv://Andrew:{options.mongoPassword}@cluster0.dcy2n.mongodb.net/?retryWrites=true&w=majority')
    mongoDatabase = mongoClient.airport_database
    mongoCollection = mongoDatabase.airport_collection

    app.run()
