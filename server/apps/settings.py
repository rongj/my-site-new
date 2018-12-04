#coding=utf-8

import os


class Config(object):

    DEBUG = False
    TESTING = False

class DevConfig(Config):

    ENV = 'dev'
    DEBUG = True

    # session
    # CSRF_ENABLED = True

    # datebase
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root@localhost:3306/flask_news?charset=utf8'
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_TRACK_MODIFICATIONS = True

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
