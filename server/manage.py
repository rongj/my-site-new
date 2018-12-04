#coding=utf-8

import os
from flask_script import Manager, Shell, Server, prompt_bool
from flask_migrate import Migrate, MigrateCommand

from apps.app import create_app
from apps.exts import db
from apps.settings import config
import apps.models

app = create_app(config['dev'])
manager = Manager(app)
migrate = Migrate(app, db)


@manager.command
def initdb():
    if prompt_bool("Are you sure? You will init your database"):
        db.create_all()


@manager.command
def dropdb():
    if prompt_bool("Are you sure ? You will lose all your data!"):
        db.drop_all()

manager.add_command('runserver', Server(host='0.0.0.0', port=9090))
manager.add_command('db', MigrateCommand)


if __name__ == '__main__':
    manager.run()