# -*- coding: utf8 -*-
import json
import pymongo
from urllib import unquote
import logging
import time

'''
From a=dafasdf&b=sdfasdfa
To {"a":"dafasdf", "b":"sdfasdfa"}
'''
def get_ulr_params(body):
    result = {}
    params = unquote(body).split("&")
    for param in params:
        kv = param.split("=")
        result[kv[0]] = json.loads(kv[1])
    return result

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
    return client

'''
Save the event to db
'''
def save_to_db(open_id, evt_obj, db):
    # create at the first time
    database = db.wegeek
    evt_obj["time"] = time.time()
    evt_obj["handled"] = False 
    events = database.user_events
    events.save(evt_obj)

'''
Main Entry
'''
def main_handler(event, context):
    #logging.info("Received event: " + json.dumps(event, indent = 2)) 
    #logging.info("Received context: " + str(context))

    open_id = None
    evt_obj = None
    try:
        open_id = event["headerParameters"]["openid"]
        body = get_ulr_params(event["body"])
        evt_obj = body["event"]
    except:
        logging.exception("failed to get enough parameters")
        raise Exception("failed to get enough parameters")

    logging.debug("openid in %s, event %s", open_id, evt_obj)

    try:
        db = init_db()
        logging.info("after init mongo db")
    except:
        logging.exception("failed to load mongo")
        raise Exception("failed to load mongo")
    
    try:
        save_to_db(open_id, evt_obj, db)
    except:
        logging.exception("failed to save to db")
        raise Exception("failed to save to db")

    return {}

if __name__ == "__main__":
    print "You are testing!"