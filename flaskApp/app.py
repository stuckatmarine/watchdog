from pymongo import MongoClient
from flask import Flask, request, jsonify, Response
from bson.json_util import dumps
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# app.run(threaded=True)

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
    user = collection.find_one({"username": username.lower()})
    mpu_ids = user['mpu_id']
    client.close()

    client, collection = connect('notifications')
    ##TODO: Add ordering
    notifications = collection.find({"mpu_id": {"$in": mpu_ids}}).limit(5)
    client.close()

    return dumps(notifications)

@app.route('/user/prefrences/<username>', methods=['GET'])
def get_user_info(username):
    client, collection = connect('users')
    user = collection.find_one({"username": username.lower()})
    client.close()

    return dumps(user)


@app.route('/user/prefrences/<username>', methods=['POST'])
def update_user_info(username):
    client, collection = connect('users')
    print(request.get_json())
    """
    collection.update_one({"username": username.lower()},
                           {"$set": 
                               {"email": request.get_json()["email"],
                                "first_name": request.get_json()["first_name"],
                                "last_name": request.get_json()["last_name"],
                                "phone": request.get_json()["phone"],
                                "address": request.get_json()["address"],
                                "address2": request.get_json()["address2"],
                                "city": request.get_json()["city"],
                                "province": request.get_json()["province"],
                                "postal_code": request.get_json()["postal_code"],
                                "contact_sms": request.get_json()["contact_sms"],
                                "contact_app": request.get_json()["contact_app"],
                                "contact_web": request.get_json()["contact_web"],
                                "contact_email": request.get_json()["contact_email"]
                                }
                            })
    """
    client.close()

    return "Success!"


if __name__ == '__main__':
    app.run()