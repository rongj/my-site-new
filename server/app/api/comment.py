# -*- coding: utf-8 -*-

from flask import request, g
from app.models import Comment
from app.utils.res import jsonWrite
from app.utils.auth import login_required

from . import bp

@bp.route('/comment/create', methods=['POST'])
def create_comment(): 
  article_id = request.values.get('article_id')
  content = request.values.get('content')
  refer_id = request.values.get('refer_id', None)
  user_id = 2
  if not all([article_id, content, user_id]):
    return jsonWrite(None, 400)
  new_comment = Comment(article_id=article_id, content=content, user_id=user_id, refer_id=refer_id)
  new_comment.save()
  return jsonWrite()


@bp.route('/comment/list', methods=['GET'])
def get_comment_list(): 
  article_id = request.values.get('article_id')
  page = request.values.get('page', 1)
  pageSize = request.values.get('pageSize', 5)
  if not article_id:
    return jsonWrite(None, 400)
  comment_query = Comment.query.filter(Comment.article_id==article_id, Comment.status==1, Comment.refer_id==None)
  comments = comment_query.offset(int(pageSize)*(int(page)-1)).limit(pageSize).all()
  total = comment_query.count()
  res = []
  for item in comments:
    sub_comments = Comment.query.filter(Comment.refer_id==item.id, Comment.status==1).all()
    res.append(dict(item.to_dict(), **{'sub_comments': [ subitem.to_dict() for subitem in sub_comments]}))
  return jsonWrite({ 'list': res, 'total': total, 'page': page, 'pageSize': pageSize })


@bp.route('/comment/delete/<int:id>', methods=['GET', 'POST'])
def delete_comment(id, **kwargs): 
  comment = comment.get_by_key(id)
  if comment is None:
    return jsonWrite('评论不存在', 201)
  comment.update(status=-1)
  return jsonWrite('删除成功')