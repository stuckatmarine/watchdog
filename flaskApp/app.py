from base64 import decodebytes
from pymongo import MongoClient
from flask import Flask, request, render_template
from bson.json_util import dumps
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import time
import os

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)


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


@app.route('/mpu/prefrences/<mpu_id>', methods=['GET'])
def get_mpu_config(mpu_id):
    client, collection = connect('users')
    user = collection.find_one({"mpu_id": int(mpu_id)})
    client.close()
    return dumps(user['mpuid'])


@app.route('/mpu/trigger/<mpu_id>', methods=['POST'])
def mpu_notification(mpu_id):
    timehex = hex(int(time.time()))
    f = open(timehex + ".jpg", "wb")
    f.write(decodebytes(request.data))
    f.close()
    notify_user("user")
    return "Success!", 200


"""
@app.route('/user/render_image', methods=['GET'])
def show_index():
    full_filename = os.path.join(app.config['UPLOAD_FOLDER'], 'shovon.jpg')
    return render_template("index.html", user_image = full_filename)
"""

@app.route('/user/notifications/<username>', methods=['GET'])
def get_user_notifications(username):
    client, collection = connect('users')
    user = collection.find_one({"username": username.lower()})
    mpu_ids = user['mpu_id']
    client.close()

    client, collection = connect('notifications')
    notifications = collection.find({"mpu_id": {"$in": mpu_ids}}).sort("time", 1).limit(5)
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


@app.route('/user/verify/<username>/<password>', methods=['GET'])
def verify_user(username, password):
    client, collection = connect('users')
    user = collection.find_one({"username": username.lower()})
    client.close()

    if user['password'] == password:
        return 'true', 200

    return 'false', 403


@app.route('/user/notify/<username>', methods=['POST'])
def notify_user(username):
    emit('notification', {'update': True})


@socketio.on('connect')
def socket_connect():
    print("\n hmm", request.sid, "Connected! \n")
    emit('notification', {'update': True})


@socketio.on('disconnect')
def socket_disconnect():
    print("\n hmm", request.sid, "Disconnection! \n")


@socketio.on_error_default  # handles all errors
def default_error_handler(e):
    print(request.event["message"])  # "my error event"
    print(request.event["args"])     # (data,)


if __name__ == '__main__':
    # socketio.run(app)
    #app.run(host='192.168.137.135', port=5000)
    app.run(host='127.0.0.1', port=5000)
