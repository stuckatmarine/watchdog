from pymongo import MongoClient
from flask import Flask   #, request, jsonify, Response
from bson.json_util import dumps
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def connect(collection):
    try:
        client = MongoClient('mongodb://admin:admin@cluster0-shard-00-00-xlfzz.gcp.mongodb.net:27017,cluster0-shard-00-01-xlfzz.gcp.mongodb.net:27017,cluster0-shard-00-02-xlfzz.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin')
        db = client['watchdog']
        collection = db[collection]
    except:
        print('error connecting to mongo!')
    finally:
        client.close()
    
    return client, collection

@app.route('/user/notifications/<username>', methods=['GET'])
def get_user_notifications(username):
    client, collection = connect('users')
    user = collection.find_one({"username": username})
    mpu_ids = user['mpu_id']
    client.close()
    
    client, collection = connect('notifications')
    ##TODO: Add ordering
    notifications = collection.find({"mpu_id": {"$in": mpu_ids}}).limit(5)
    client.close()
    
    return dumps(notifications)