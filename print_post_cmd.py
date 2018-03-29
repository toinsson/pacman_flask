import zmq
import threading
class ThreadedSubscriber(threading.Thread):
    """Threaded and non-blocking.
    """
    def __init__(self, port=8765):

        super(ThreadedSubscriber, self).__init__()
        self.is_looping = threading.Event()
        self.port = port

    def run(self):

        # 0mq socket
        self.context = zmq.Context()
        self.socket = self.context.socket(zmq.SUB)
        self.socket.connect("tcp://127.0.0.1:{}".format(self.port))
        self.socket.setsockopt_string(zmq.SUBSCRIBE, "")

        # 0mq poller
        self.poller = zmq.Poller()
        self.poller.register(self.socket, zmq.POLLIN)

        self.is_looping.set()
        while self.is_looping.is_set():
            socks = dict(self.poller.poll(100))
            if self.socket in socks and socks[self.socket] == zmq.POLLIN:
                data = self.socket.recv_pyobj()
                print(data)

    def stop(self):
        self.is_looping.clear()
        self.join()  # wait for thread to finish
        self.socket.close()
        self.context.term()

ts = ThreadedSubscriber()
ts.start()

import time

flag = True
while flag:
    try:
        time.sleep(0.001)
    except KeyboardInterrupt:
        ts.stop()
        flag = False