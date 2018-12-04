from flask import Flask
from apps.settings import DevConfig
from apps.exts import db

from apps.user.views import user 

def create_app(config=None):
    app = Flask(__name__)

    configure_app(app, config)
    configure_extensions(app)
    configure_blueprints(app)

    return app


def configure_app(app, config):
    if not config:
        config = DevConfig
    
    app.config.from_object(config)


def configure_extensions(app):
    db.init_app(app)


def configure_blueprints(app):
    app.register_blueprint(user, url_prefix='')
