import pymongo
from bson.json_util import dumps

def connect(collection):
    try:
        client = pymongo.MongoClient('mongodb://admin:admin@cluster0-shard-00-00-xlfzz.gcp.mongodb.net:27017,cluster0-shard-00-01-xlfzz.gcp.mongodb.net:27017,cluster0-shard-00-02-xlfzz.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin')
        db = client['watchdog']
        collection = db[collection]
    except Exception as e:
        print('error connecting to mongo!')
        raise e
    finally:
        client.close()

    return client, collection

username = "User"
client, collection = connect('users')
user = collection.find_one({"username": username.lower()})
mpu_ids = user['mpu_id']
client.close()

client, collection = connect('notifications')
notifications = collection.find({"mpu_id": {"$in": mpu_ids}}).sort("time", -1).limit(5)
client.close()

notifications = dumps(notifications)

print(notifications)