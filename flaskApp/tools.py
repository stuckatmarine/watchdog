import pymongo
import smtplib
import imghdr
from twilio.rest import Client
from email.message import EmailMessage
from environs import Env

env = Env()
env.read_env()


def parse_results(data):
    string = ''

    for key, value in data.items():
        if 'time' not in key:
            string += key + ': ' + value[0]['confidence'] + '%\n'

    return string


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


def send_text(number, body):
    account_sid = env('account_sid')
    auth_token = env('auth_token')
    client = Client(account_sid, auth_token)

    client.messages.create(
                        body=body,
                        from_='+17098003001',
                        to=number
                        )


def send_email(user_email, data, img):
    msg = EmailMessage()
    msg.set_content(data)

    msg['Subject'] = 'Watchdog Notification!'
    msg['From'] = 'anash@mun.ca'
    msg['To'] = user_email
    msg.add_attachment(img, maintype='image', subtype=imghdr.what(None, img))

    s = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    s.ehlo()
    s.login('adn432@mun.ca', env('gmail_password'))
    s.send_message(msg)
    s.quit()


if __name__ == '__main__':
    import json

    with open('sample.txt', 'r') as f:
        data = json.load(f)

    print(parse_results(data))
