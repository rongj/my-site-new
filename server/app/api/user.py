# -*- coding: utf-8 -*-

from flask import request, g
from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, current_user
from app.models import User
from app.utils.res import jsonWrite

from . import bp

@bp.route('/auth/register', methods=['GET', 'POST'])
def register(): 
  username = request.values.get('username')
  password = request.values.get('password')
  if username is None or password is None:
    return jsonWrite(None, 400)
  user = User.query.filter_by(username=username).first()
  if user is not None:
    return jsonWrite('用户名已存在', 201)
  hash_pwd = User.set_password(password)
  newobj = User(username=username, password=hash_pwd)
  res = newobj.save()
  print(res)
  if res is None:
    return jsonWrite('注册失败', 201)
  return jsonWrite()


@bp.route('/auth/login', methods=['GET', 'POST'])
def login():
  username = request.values.get('username')
  password = request.values.get('password')
  if username is None or password is None:
    return jsonWrite(None, 400)
  user = User.query.filter_by(username=username).first()
  if user is None:
    return jsonWrite('用户不存在', 201)
  if not user.chcheck_passwordec(password):
    return jsonWrite('用户名或密码错误', 201)
  return jsonWrite(dict({'token': create_access_token(identity=user, fresh=True)}, **user.to_dict()))


# @bp.route('/auth/resetpwd', methods=['GET', 'POST'])
# @login_required
# def reset():
#   oldpwd = request.values.get('oldpwd')
#   newpwd = request.values.get('newpwd')
#   if oldpwd is None or newpwd is None:
#     return jsonWrite('旧密码或新密码不能为空', 201)
#   if oldpwd == newpwd:
#     return jsonWrite('新密码不能和旧密码一样', 201)
#   user = User.get_one(g.current_user['id'])
#   if user is None:
#     return jsonWrite('用户不存在', 201)
#   hash_pwd = generate_password_hash(newpwd)
#   print(hash_pwd)
#   user.password = hash_pwd
#   user.save()
#   return jsonWrite()


# @bp.route('/auth/bind', methods=['GET', 'POST'])
# @login_required
# def bind():
#   bindType = request.values.get('type')
#   bindValue = request.values.get('value')
#   if bindType is None or bindValue is None:
#     return jsonWrite(None, 400)
#   originUser = User.get_one(g.current_user['id'])
#   if bindType == 'phone':
#     if originUser.phone is not None:
#       return jsonWrite('该用户已经绑定手机号', 201)
#     user = User.get_one(bindValue, 'phone')
#     if user is not None:
#       return jsonWrite('该手机号已绑定其他账号', 201)
#     originUser.update(phone=bindValue)
  
#   if bindType == 'email':
#     if originUser.email is not None:
#       return jsonWrite('该用户已经绑定邮箱账号', 201)
#     user = User.query.filter_by(email=bindValue).first()
#     if user is not None:
#       return jsonWrite('该邮箱账号已绑定其他账号', 201) 
#     originUser.update(email=bindValue)

#   return jsonWrite()
