# -*- coding: utf8 -*-
import json
import pymongo
from urllib import unquote
import logging
import time
import jieba
import codecs
import pickle
from gensim import corpora,models,similarities

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
def init_db(online = True):
    url = load_config("mongo.url")
    client = pymongo.MongoClient(url)
    if not online:
        database = client.wegeek_offline
    else:
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
Query from db where the 'handled' is not set
'''
def query_from_db(db):
    events = db.user_events
    results = []
    to_remove = []
    for e in events.find({"handled" : False}):
        if not event_valid(e):
            to_remove.append(e)
        else:
            results.append(e)
    
    if to_remove:
        events.remove(to_remove, multi=True)
    
    return results

'''
Load all the stop words to set
'''
def load_stop_words():
    with codecs.open('stop_words.txt', 'r', encoding='gbk') as f:
        return set(f.read().splitlines())

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
    
    try:
        offline_db = init_db(online = False)
    except:
        logging.exception("failed to load offline database")
        raise Exception("failed to load offline database")

    events = []
    try:
        events = query_from_db(db)
    except:
        logging.exception("failed to query from db")
        raise Exception("failed to query from db")

    logging.info("get %s events from db", len(events))

    handled = []
    start_time = time.time()

    dictionary = None
    dic = offline_db.total.find_one({"key": "dictionary"})
    if not dic:
        dictionary = corpora.Dictionary([])
        offline_db.save({"key": "dictionary", "value": pickle.dump(dictionary)})
    else:
        dictionary = pickle.load(dic["value"])

    logging.info("get total count %s", total_count)

    stop_words = load_stop_words()

    for event in events:
        current_time = time.time()
        if current_time - start_time > 150.0:
            # already used 150 seconds, break
            break

        # if event is too short
        content = event["page_content"]
        if len(content) < 50:
            logging.debug("the content is too short for process.")
            handled.append(event)
            continue
        
        # if event is all english
    
        
        # split the content
        content = content.replace("\r\n", "")
        content = content.replace(" ", "")
        
        cut_result = jieba.cut_for_search()
        after_filter = []
        for w in cut_result:
            if w in stop_words:
                continue
            after_filter.append(w)
        dictionary.add_documents([after_filter])
        offline_db.total.update({"key":"dictionary"}, {"$set":{"value": pickle.dump(dictionary)}})
        handled.append(event)

    db.user_events.remove(handled, multi=True)
    return {}

if __name__ == "__main__":
    print "You are testing!"

    import jieba
    import codecs
    from gensim import corpora,models,similarities
    from collections import defaultdict
    content = u"今天天气挺好的，再次下午看到学校的小河边有几位老人在钓鱼，让我想起小的时候，经常和爷爷一起去钓鱼，我们一起坐在柳树下，夕阳下的爷爷戴个草帽，当我钓上鱼而欢呼雀跃时，他总是转过头，咧开嘴对我笑。哎，真想再和爷爷钓一次鱼呀，可惜...                     2017年4月5日"
    content = content.replace("\r\n", "")
    content = content.replace(" ", "")
    cut_result = jieba.cut_for_search(content)

    stopWords_dic = codecs.open('stop_words.txt', 'r', encoding='gbk')
    stopWords_content = stopWords_dic.read()

    stopWords_list = stopWords_content.splitlines()
    stopWords_dic.close()
    print stopWords_list

    test = []
    for w in cut_result:
        if w not in stopWords_list:
            test.append(w)

    dictionary = corpora.Dictionary([test])
    dictionary.save_as_text('dictionary.txt')
    print dictionary

    dictionary = dictionary.merge_with(dictionary)
    print dictionary
