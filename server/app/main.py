# -*- coding: utf-8 -*-

from flask import Flask
from .settings import DevConfig
from .extensions import db, cors, bcrypt, cache, jwt

from .api import bp as api_bp 

def create_app(config=None):
  app = Flask(__name__)
  
  configure_app(app, config)
  configure_extensions(app)
  configure_blueprints(app)
  app.app_context().push()
  return app


def configure_app(app, config):
  if not config:
    config = DevConfig
  
  app.config.from_object(config)


def configure_extensions(app):
  db.init_app(app)
  bcrypt.init_app(app)
  cache.init_app(app)
  jwt.init_app(app)
  

def configure_blueprints(app):
  origins = app.config.get('CORS_ORIGIN_WHITELIST', '*')
  cors.init_app(api_bp, origins=origins)
  app.register_blueprint(api_bp, url_prefix='/api')