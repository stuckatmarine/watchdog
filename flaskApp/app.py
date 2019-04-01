from tools import connect, parse_results, send_text, send_email
from base64 import decodebytes
from flask import Flask, request, send_file
from bson.json_util import dumps
from flask_cors import CORS
from flask_socketio import SocketIO
import time
import os
import threading
import datetime
import json

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, ping_timeout=360000)


@app.route('/mpu/prefrences/<mpu_id>', methods=['GET'])
def get_mpu_config(mpu_id):
    client, collection = connect('users')
    user = collection.find_one({"mpu_id": int(mpu_id)})
    client.close()
    return dumps(user['mpuid'])


@app.route('/mpu/trigger/<mpu_id>', methods=['POST'])
def mpu_notification(mpu_id):
    # Save the file
    timehex = hex(int(time.time()))
    with open('localStorage/' + timehex + ".jpg", "wb") as f:
        f.write(decodebytes(request.data))

    # Update notifications table
    client, collection = connect('notifications')
    text = parse_results(json.loads(request.headers["Metadata"]))
    notification = {'mpu_id': int(mpu_id),
                    'description': text,
                    'time': datetime.datetime.utcnow(),
                    'photo': timehex}
    collection.insert_one(notification)
    client.close()

    # check user settings
    client, collection = connect('users')
    user = collection.find_one({"mpu_id": int(mpu_id)})
    client.close()

    # update corisponding front-ends
    if user['contact_web']:
        socketio.emit('notification', {'update': True}, broadcast=True)

    if user['contact_sms']:
        send_text(user['phone'], text)

    if user['contact_email']:
        send_email(user['email'], text, decodebytes(request.data))

    return "Success!", 200


@app.route('/user/render_image/<photo>', methods=['GET'])
def show_index(photo):
    return send_file(os.path.join('localStorage', photo + '.jpg'))


@app.route('/user/notifications/<username>', methods=['GET'])
def get_user_notifications(username):
    client, collection = connect('users')
    user = collection.find_one({"username": username.lower()})
    mpu_ids = user['mpu_id']
    client.close()

    client, collection = connect('notifications')
    notifications = collection.find({"mpu_id": {"$in": mpu_ids}}).sort("time", -1).limit(5)
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
    # print(request.get_json())
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
                                }
                            })
    client.close()

    return "Success!"


@app.route('/user/settings/<username>', methods=['POST'])
def update_user_settings(username):
    client, collection = connect('users')
    # print(request.get_json())
    collection.update_one({"username": username.lower()},
                           {"$set":
                               {"email": request.get_json()["email"],
                                "phone": request.get_json()["phone"],
                                "mpuid.startTime": request.get_json()["start_time"],
                                "mpuid.endTime": request.get_json()["end_time"],
                                "mpuid.interval": request.get_json()["interval"],
                                "mpuid.vFlip": request.get_json()["v_flip"],
                                "mpuid.hFlip": request.get_json()["h_flip"],
                                "mpuid.minConfidence": request.get_json()["min_confidence"],
                                "mpuid.classNames": request.get_json()["object"],
                                "contact_sms": request.get_json()["contact_sms"],
                                "contact_app": request.get_json()["contact_app"],
                                "contact_web": request.get_json()["contact_web"],
                                "contact_email": request.get_json()["contact_email"]
                                }
                            })
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


@app.route('/test_connection', methods=['GET'])
def test():
    return "Success!", 200


@socketio.on('connect')
def socket_connect():
    print(request.sid, "Connected! \n")


@socketio.on('disconnect')
def socket_disconnect():
    print(request.sid, "Disconnection! \n")


@socketio.on_error_default  # handles all errors
def default_error_handler(e):
    print(request.event["message"])  # "my error event"
    print(request.event["args"])     # (data,)


if __name__ == '__main__':
    sock_thread = threading.Thread(socketio.run(app, host='192.168.43.7', port=5000))
    sock_thread.start()

    # host='192.168.137.135'
    flask_thread = threading.Thread(app.run(host='192.168.43.7', port=5000))
    flask_thread.start()
