# Backend Flask

Basically this portion of the stack acts as the connection between the MPU and any front end

## File System

```
.
├── /localStorage/     # Photo storage from notifications
├── /app.py            # Main Flask file, should be used to run server
├── /test.py           # Scrap file for testing during development
├── /tools.py          # Helper methods for Flask to use
```

### Prerequisites

Get Python 3 [here](https://www.python.org/download/releases/3.0/)

### Installing

pip install the following libraries (or in an env)

```shell
$ pip install flask flasksocketio flask_cors twilio environs pymongo imghdr
```

Then simply run the flask server

```
$ export FLASK_APP=app.py
$ python -m flask run
 * Running on http://127.0.0.1:5000/
```

## Built With

* [Flask](http://www.dropwizard.io/1.0.2/docs/) - Backend framework
* [Flask Socketio](https://flask-socketio.readthedocs.io/en/latest/) - Sockets for live web updates
* [Flask Cors](https://flask-cors.readthedocs.io/en/latest/) - For cross origin with any MPU
* [Pymongo](https://maven.apache.org/) - Database connection
* [twilio](https://www.twilio.com/) - Text Notifications
* [environs](https://pypi.org/project/environs/) - env variables for secret stuff
