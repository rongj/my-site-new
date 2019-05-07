# -*- coding: utf-8 -*-

import os


class Config(object):
  DEBUG = False
  TESTING = False


class DevConfig(Config):
  ENV = 'dev'
  DEBUG = True

  # session
  # session
  CSRF_ENABLED = True
  SECRET_KEY = "asgSfsf3Xd8ffy]fw8vfd0zbvssqwertsd4sdwe"

  # datebase
  SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root@127.0.0.1:3306/flask_news?charset=utf8mb4'
  SQLALCHEMY_ECHO = True
  SQLALCHEMY_TRACK_MODIFICATIONS = True

  CORS_ORIGIN_WHITELIST = '*'


class TestConfig(Config):
  ENV = 'test'
  TESTING = True


class ProdConfig(Config):
  ENV = 'prod'
  DEBUG = False


config = {
  'dev': DevConfig,
  'test': TestConfig,
  'prod': ProdConfig,
  'default': DevConfig
}
