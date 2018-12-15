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
    database = client.wegeek
    return database

'''
Check whether the event is valid
'''
def event_valid(evt_obj):
    if "type" not in evt_obj:
        return False

    if evt_obj["type"] not in ["submit", "like", "view", "comment"]:
        return False
    
    if evt_obj["type"] == "submit":
        if "page_content" not in evt_obj:
            return False
        elif evt_obj["page_content"].strip() == "":
            return False
    return True

'''
Save the event to db
'''
def save_to_db(open_id, evt_list, db):
    to_save = []
    for evt_obj in evt_list:
        if not event_valid(evt_obj):
            logging.debug("Event not valid, %s", evt_obj)
            continue
        
        evt_obj["time"] = time.time()
        evt_obj["handled"] = False
        evt_obj["trigger"] = open_id
        to_save.append(evt_obj)

    events = db.user_events
    events.insert(to_save)

'''
Main Entry
'''
def main_handler(event, context):
    #logging.info("Received event: " + json.dumps(event, indent = 2)) 
    #logging.info("Received context: " + str(context))

    open_id = None
    evt_list = None
    try:
        open_id = event["headerParameters"]["openid"]
        body = get_ulr_params(event["body"])
        evt_list = body["event"]
    except:
        logging.exception("failed to get enough parameters")
        raise Exception("failed to get enough parameters")

    logging.debug("openid in %s, event %s", open_id, evt_list)

    try:
        db = init_db()
        logging.info("after init mongo db")
    except:
        logging.exception("failed to load mongo")
        raise Exception("failed to load mongo")
    
    try:
        save_to_db(open_id, evt_list, db)
    except:
        logging.exception("failed to save to db")
        raise Exception("failed to save to db")

    return {}

if __name__ == "__main__":
    print "You are testing!"