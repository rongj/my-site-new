# -*- coding: utf-8 -*-

from flask import request, g
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User
from app.utils.res import jsonWrite
from app.utils.auth import login_required, generate_token

from . import bp

@bp.route('/auth/register', methods=['POST'])
def register(): 
  username = request.json.get('username')
  password = request.json.get('password')
  role = request.json.get('role', 1)
  if username is None or password is None:
    return jsonWrite(None, 400)
  user = User.query.filter_by(username=username).first()
  if user is not None:
    return jsonWrite('用户名已存在', 201)
  hash_pwd = generate_password_hash(password)
  newobj = User(username=username, password=hash_pwd, role=role)
  newobj.save()
  return jsonWrite()


@bp.route('/auth/login', methods=['POST'])
def login():
  username = request.json.get('username')
  password = request.json.get('password')
  if username is None or password is None:
    return jsonWrite(None, 400)
  user = User.query.filter_by(username=username).first()
  if user is None:
    return jsonWrite('用户不存在', 201)
  if not check_password_hash(user.password, password):
    return jsonWrite('用户名或密码错误', 201)
  login_user = user.to_dict()
  return jsonWrite(dict({'token': generate_token(login_user)}, **login_user))


@bp.route('/auth/user', methods=['GET', 'POST'])
@login_required
def get_user():
  return jsonWrite(g.current_user)


@bp.route('/auth/resetpwd', methods=['POST'])
@login_required
def reset():
  oldpwd = request.json.get('oldpwd')
  newpwd = request.json.get('newpwd')
  if oldpwd is None or newpwd is None:
    return jsonWrite('旧密码或新密码不能为空', 201)
  if oldpwd == newpwd:
    return jsonWrite('新密码不能和旧密码一样', 201)
  user = User.get_by_key(g.current_user['id'])
  if user is None:
    return jsonWrite('用户不存在', 201)
  hash_pwd = generate_password_hash(newpwd)
  print(hash_pwd)
  user.password = hash_pwd
  user.save()
  return jsonWrite()


@bp.route('/auth/bind', methods=['POST'])
@login_required
def bind():
  bindType = request.json.get('type')
  bindValue = request.json.get('value')
  if bindType is None or bindValue is None:
    return jsonWrite(None, 400)
  originUser = User.get_by_key(g.current_user['id'])
  if bindType == 'phone':
    if originUser.phone is not None:
      return jsonWrite('该用户已经绑定手机号', 201)
    user = User.get_by_key(bindValue, 'phone')
    if user is not None:
      return jsonWrite('该手机号已绑定其他账号', 201)
    originUser.update(phone=bindValue)
  
  if bindType == 'email':
    if originUser.email is not None:
      return jsonWrite('该用户已经绑定邮箱账号', 201)
    user = User.query.filter_by(email=bindValue).first()
    if user is not None:
      return jsonWrite('该邮箱账号已绑定其他账号', 201) 
    originUser.update(email=bindValue)

  return jsonWrite()
