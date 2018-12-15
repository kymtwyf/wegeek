# -*- coding: utf8 -*-
import json
import pymongo
from urllib import unquote
import logging
import time

'''
Load config from config.json
'''
def load_config(key):
    with open("config.json") as f:
        config = json.load(f)
        return config[key]

'''
Init mongodb connection
'''
def init_db():
    url = load_config("mongo.url")
    client = pymongo.MongoClient(url)
    database = client.wegeek
    return database

'''
Query from db where the 'handled' is not set
'''
def query_from_db(db):
    events = db.user_events
    results = []
    for e in events.find({"handled" : False}):
        results.append(e)
    return results

'''
Main Entry
'''
def main_handler(event, context):
    logging.debug("On timer")

    try:
        db = init_db()
        logging.info("after init mongo db")
    except:
        logging.exception("failed to load mongo")
        raise Exception("failed to load mongo")
    

    events = []
    try:
        events = query_from_db(db)
    except:
        logging.exception("failed to query from db")
        raise Exception("failed to query from db")

    logging.info(events)
    return {}

if __name__ == "__main__":
    print "You are testing!"