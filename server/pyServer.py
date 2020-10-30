from flask import Flask, request
app = Flask(__name__)


@app.route('/')
def index():
    print("Hello")
    return 'hello world'


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
