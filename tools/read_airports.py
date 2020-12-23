import csv
import pymongo
from optparse import OptionParser


def readInternationalAirports(includedCols=range(18)):
    internationalAirports = []
    with open('airports.csv', newline='\n') as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        for row in reader:
            content = list(row[i] for i in includedCols)
            # Airports with regular service + iata code + medium/large airports
            if content[13] and content[11] == "yes" and (content[2] == "large_airport" or content[2] == "medium_aiport"):
                document = {
                    '_id': content[0],
                    'name': content[3],
                    'latitude': content[4],
                    'longitude': content[5],
                    'iso_country': content[8],
                    'municipality': content[10],
                    'iata_code': content[13]
                }
                internationalAirports.append(document)
    return internationalAirports


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

    insertions = readInternationalAirports()
    result = mongoCollection.insert_many(insertions)

    print(f'Insertion success: {result}')
