# -*- coding: utf-8 -*-

from flask import request, g
from app.models import Aricle
from app.utils.res import jsonWrite
from app.utils.auth import login_required

from . import bp

@bp.route('/article/create', methods=['POST'])
def create(): 
  user_id = g.current_user.get('id') if g.get('current_user') else None
  title = request.values.get('title')
  body = request.values.get('body')
  if title is None or body is None:
    return jsonWrite(None, 400)
  newPost = Post(user_id=user_id, title=title, body=body)
  newPost.save()
  return jsonWrite()


@bp.route('/article/<int:id>', methods=['GET'])
def get_article(id): 
  article = Post.query.filter_by(id=id).first()
  if article is None:
    return jsonWrite('文章不存在', 201)
  return jsonWrite(article.to_dict())


@bp.route('/article/update', methods=['GET', 'POST'])
def update_article(): 
  pass
  # article = Post.query.filter_by(id=id).first()
  # if article is None:
  #   return jsonWrite('文章不存在', 201)
  # return jsonWrite(article.to_dict())
