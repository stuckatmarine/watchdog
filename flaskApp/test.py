import socket
from flask_socketio import SocketIO, send, emit


s = socket.create_connection('http://127.0.0.1:5000/')
