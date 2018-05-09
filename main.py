from future.utils import viewitems

import flask
from flask import request, Response

import json

app = flask.Flask(__name__, static_url_path='')

import zmq
class Publisher(object):
    def __init__(self, port=8765):
        super(Publisher, self).__init__()
        self.context = zmq.Context()
        self.socket = self.context.socket(zmq.PUB)
        self.socket.bind("tcp://127.0.0.1:{}".format(port))

    def send_message(self, header, message):
        self.socket.send_pyobj([header, message])

    def close(self):
        self.socket.close()
        self.context.term()


# might need some configuration
pub = Publisher()
speedvalue = 60


@app.route("/")
def root():
    return app.send_static_file('debug.htm')


@app.route('/speedvalue', methods = ['POST', 'GET'])
def get_post_speedvalue():
    global speedvalue

    if request.method == 'GET':
        return Response(str(speedvalue), mimetype='text/plain')

    if request.method == 'POST':
        speedvalue = request.form.to_dict()['speedvalue']
        return Response('ok', mimetype='text/plain')


@app.route('/postmethod', methods = ['POST'])
def get_post_javascript_data():
    d = request.form.to_dict()
    key = d.pop('key', None)
    pub.send_message(key, d)
    return Response('ok', mimetype='text/plain')


