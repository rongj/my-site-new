# -*- coding: utf-8 -*-

from functools import wraps
from flask import request, g, current_app
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from itsdangerous import SignatureExpired, BadSignature
from app.utils.res import jsonWrite

DEFAULT_VALIDITY = 60*60*24*7

def generate_token(user, expiration=DEFAULT_VALIDITY):
  s = Serializer(current_app.config['SECRET_KEY'], expires_in=expiration)
  token = s.dumps({
    'id': user.id,
    'username': user.username,
  }).decode('utf-8')
  return token


def verify_token(token):
  s = Serializer(current_app.config['SECRET_KEY'])
  try:
    data = s.loads(token)
  except (BadSignature, SignatureExpired):
    return None
  return data


def login_required(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    token = request.headers.get('Authorization', None)
    if token:
      string_token = token.encode('ascii', 'ignore')
      user = verify_token(string_token)
      if user:
        g.current_user = user
        return f(*args, **kwargs)
    return jsonWrite(None, 401)

  return decorated
