# -*- coding: utf8 -*-
import json
import pymongo
from urllib import unquote
import logging

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
Main Entry
'''
def main_handler(event, context):
    logging.info("Received event: " + json.dumps(event, indent = 2)) 
    logging.info("Received context: " + str(context))
    logging.info("Hello world")

    try:
        openId = event["headerParameters"]["openid"]
        body = get_ulr_params(event["body"])
        content = body["event"]
    except:
        logging.exception("failed to get enough parameters")
        raise Exception("failed to get enough parameters")

    logging.debug("openid in %s, event %s", openId, content)

    try:
        db = init_db()
        logging.info("after init mongo db")
    except:
        logging.exception("failed to load mongo")
        raise Exception("failed to load mongo")

    return {"ret" : "success"}

if __name__ == "__main__":
    print "You are testing!"