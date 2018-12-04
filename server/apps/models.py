#coding=utf-8

from datetime import datetime as dt
from apps.exts import db


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True)
    email = db.Column(db.String(320), unique=True)
    created_at = db.Column(db.DateTime, nullable=False, default=dt.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=dt.utcnow)

    # def __init__(self, username, email, **kwargs):
    #     db.Model.__init__(self, username=username, email=email, **kwargs)

    def __repr__(self):
        return '<User %r>' % self.username
