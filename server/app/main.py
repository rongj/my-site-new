# -*- coding: utf-8 -*-

from flask import Flask
from .settings import get_config
from .extensions import db, cors, bcrypt, cache
from .api import bp as api_bp 

def create_app(config_name):
  app = Flask(__name__)
  
  configure_app(app, config_name)
  configure_extensions(app)
  configure_blueprints(app)
  app.app_context().push()
  return app


def configure_app(app, config_name='DEVELOPMENT'):  
  config = get_config(config_name)
  app.config.update(config)

def configure_extensions(app):
  db.init_app(app)
  bcrypt.init_app(app)
  # cache.init_app(app)
  

def configure_blueprints(app):
  origins = app.config.get('CORS_ORIGIN_WHITELIST', '*')
  cors.init_app(api_bp, origins=origins)
  app.register_blueprint(api_bp, url_prefix='/api')