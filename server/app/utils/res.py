# -*- coding: utf-8 -*-

import json
from flask import jsonify, request

def jsonWrite(data=None, code=200):
  codeMsg = {
		200: "成功",
		201: "错误",
		400: "参数错误",
		401: "权限认证失败",
		500: "系统异常",
	}

  result = dict({
    'code': code,
    'msg': data if type(data) == str else codeMsg[code]
  }, **{ 'data': data } if type(data) == dict or type(data) == list else {})

  # 兼容jsonp
  if request.args.get('callback') is not None:
    return request.args['callback'] + '(' + json.dumps(result) + ')'

  return jsonify(result)