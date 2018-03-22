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
        self.socket.bind("tcp://127.0.0.1:5557")

    def send_message(self, header, message):
        # data = [header, message]
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
    # do something with the data
    # print(request.form)

    pub.send_message('score', request.form['state'])

    return Response('ok', mimetype='text/plain')


# create a publisher for the JS data.
