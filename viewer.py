import os
import json
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.websocket
from tornado.web import url
import requests
from naruhodo import parser

class ViewerHandler(tornado.web.RequestHandler):
    """RESTful API handler."""
    def get(self, *args, **kwargs):
        self.render('index.html')

    def post(self, *args, **kwargs):
        data = json.loads(self.request.body.decode('utf-8'))
        texts = None
        if data['lang'] != gclient.lang or data['gtype'] != gclient.gtype:
            gclient.change(data['lang'], data['gtype'])
        if data['reset']:
            gclient.reset()
            print("Reset the graph!")
        elif data['mode'] == 'text':
            texts = gclient.add(data['inp'])
        elif data['mode'] == 'url':
            texts = gclient.addUrls(data['inp'])
        else:
            raise ValueError("Unrecognized mode: {0}".format(data['mode']))
        response = gclient.exportObj(texts)
        self.write(json.dumps(response))

class Application(tornado.web.Application):
    """Application configuration"""
    def __init__(self, debug):
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        tornado.web.Application.__init__(self,
                                         [
                                            url(r'/', ViewerHandler, name='index'),
                                         ],
                                         template_path=os.path.join(BASE_DIR, 'templates'),
                                         static_path=os.path.join(BASE_DIR, 'static'),
                                         debug=debug
                                    )

if __name__ == '__main__':
    with open("config.json") as json_data:
        config = json.load(json_data)
    app = Application(config['debug'])
    gclient = parser(mp=config['mp'], wv=config['wv'])
    server = tornado.httpserver.HTTPServer(app)
    server.listen(8000)
    tornado.ioloop.IOLoop.instance().start()
