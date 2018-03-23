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

@app.route("/")
def root():
    return app.send_static_file('debug.htm')

@app.route('/postmethod', methods = ['POST'])
def get_post_javascript_data():

    for k,v in viewitems(request.form.to_dict()):
        pub.send_message(str(k), v)

    return Response('ok', mimetype='text/plain')
