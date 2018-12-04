#coding=utf-8
from flask import Blueprint, request
import json

user = Blueprint('user', __name__)

@user.route('/login', methods=['GET'])
def login():
    return 'login'

@user.route('/register', methods=['GET'])
def register():
    return 'register'

@user.route('/user/create', methods=['GET'])
def add():
    # newobj = User(username=p_user, email=p_email)
    # db.session.add(newobj)
    # db.session.commit()
    # users = User.query.all()
    return json.dumps(request.args)