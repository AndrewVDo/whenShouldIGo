import json
import pymongo
from optparse import OptionParser


def readCurrency():
    insertions = []
    with open('currency.json') as json_file:
        data = json.load(json_file)
        for c in data:
            if c['country'] and c['currency']:
                insertions.append(c)
    return insertions


if __name__ == "__main__":
    parser = OptionParser()
    parser.add_option("--password", dest="mongoPassword")
    options, args = parser.parse_args()

    if not options.mongoPassword:
        parser.error('mongoPassword not given')

    mongoClient = pymongo.MongoClient(
        f'mongodb+srv://Andrew:{options.mongoPassword}@cluster0.dcy2n.mongodb.net/?retryWrites=true&w=majority')
    mongoDatabase = mongoClient.currency_database
    mongoCollection = mongoDatabase.currency_map

    insertions = readCurrency()
    result = mongoCollection.insert_many(insertions)

    print(f'Insertion success: {result}')
