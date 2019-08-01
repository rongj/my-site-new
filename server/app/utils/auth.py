# -*- coding: utf-8 -*-

import jwt
from datetime import datetime, timedelta
from flask import request, current_app, g
from functools import wraps
from app.utils.res import jsonWrite

def generate_token(access_user, exp=24, algorithm='HS256'):
  ''' 
  生成access_token
  :param user_id:自定义部分
  :param exp:过期时间
  :param algorithm:加密算法
  :return:
  '''
  key = current_app.config.get('SECRET_KEY')
  now = datetime.utcnow()
  exp_datetime = now + timedelta(hours=exp)
  access_payload = {
    'exp': exp_datetime,
    'iat': now,
    'iss': 'rong',
    'data': access_user
  }
  access_token = jwt.encode(access_payload, key, algorithm=algorithm).decode("utf-8")
  return access_token


def verify_token(token):
  """
  验证token
  :param token:
  :return:
  """
  key = current_app.config.get('SECRET_KEY')
  try:
    payload = jwt.decode(token, key, options= {'verify_exp':False})
    if ('data' in payload and 'id' in payload['data']):
      return payload['data']
  except jwt.ExpiredSignatureError:
    return 'Token过期'
  except (jwt.InvalidSignatureError, jwt.InvalidTokenError):
    return '无效的Token'


def login_required(f):
  """
  登陆保护，验证用户是否登陆
  :param f:
  :return:
  """
  @wraps(f)
  def wrapper(*args, **kwargs):
    token = request.headers.get('Authorization', None)
    if token:
      res = verify_token(token)
      print(res)
      if res and 'id' in res:
        g.current_user = res
        return f(*args, **kwargs)
      else:
        return jsonWrite(res or '找不到该用户信息', 201)
    else:
      return jsonWrite('没有提供认证token', 201)
  return wrapper