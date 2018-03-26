import os
import sys
import json
import tornado.httpserver
import tornado.ioloop
import tornado.web
from tornado.web import url
import requests
from naruhodo import parser

class ViewerHandler(tornado.web.RequestHandler):
    """RESTful API handler."""
    def get(self, *args, **kwargs):
        self.render('index.html', server=cfg['server_ip']+':'+str(cfg['server_port']))

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
        response = gclient.exportObj()
        response['texts'] = texts
        response['corefList'] = list(gclient.corefDict)
        response['synonymList'] = list(gclient.synonymDict)
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

def loadConfig(fname):
    """Load configuration from given cfg file."""
    if os.path.isfile(fname):
        with open(fname) as json_data:
            cfg = json.load(json_data)
    else:
        cfg = dict()
        print("Invalid config file name. Using default configurations.")
    if 'mp' not in cfg:
        cfg['mp'] = False
    if 'wv' not in cfg:
        cfg['wv'] = ""
    if 'debug' not in cfg:
        cfg['debug'] = False
    if 'server_ip' not in cfg:
        cfg['server_ip'] = 'http://localhost'
    if 'server_port' not in cfg:
        cfg['server_port'] = 8000
    if 'coref' not in cfg:
        cfg['coref'] = True
    return cfg

if __name__ == '__main__':
    cfg = loadConfig(sys.argv[1])
    app = Application(cfg['debug'])
    gclient = parser(mp=cfg['mp'], wv=cfg['wv'], coref=cfg['coref'])
    server = tornado.httpserver.HTTPServer(app)
    server.listen(cfg['server_port'])
    tornado.ioloop.IOLoop.instance().start()
