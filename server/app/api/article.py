# -*- coding: utf-8 -*-

from flask import request, g
from app.models import Article, Tag
from app.utils.res import jsonWrite
from app.utils.auth import login_required

from . import bp

@bp.route('/article/create', methods=['POST'])
@login_required
def create_article(): 
  user_id = g.current_user.get('id') if g.get('current_user') else None
  title = request.values.get('title')
  content = request.values.get('content')
  category_id = request.values.get('category_id')
  tags = request.values.get('tags')
  if not all([title, content, category_id, tags]):
    return jsonWrite(None, 400)
  new_article = Article(user_id=user_id, title=title, content=content, category_id=category_id)
  for item in tags.split(','):
    tag = Tag.get_filter(id=item)
    new_article.add_tag(tag)
  new_article.save()
  return jsonWrite()


@bp.route('/article/list', methods=['GET'])
def get_article_list(): 
  page = request.values.get('page', 1)
  pageSize = request.values.get('pageSize', 5)
  category_id = request.values.get('category_id', None)
  article_query = Article.query.filter_by(status=1).order_by('created_at desc')
  if category_id:
    article_query = article_query.filter_by(category_id=category_id)
  articles = article_query.offset(int(pageSize)*(int(page)-1)).limit(pageSize).all()
  total = article_query.count()
  res = [item.to_dict() for item in articles]
  return jsonWrite({ 'list': res, 'total': total, 'page': int(page), 'pageSize': int(pageSize) })


@bp.route('/article/<int:id>', methods=['GET'])
def get_article(id): 
  article = Article.get_one(id)
  if article is None:
    return jsonWrite('文章不存在', 201)
  return jsonWrite(article.to_dict())


@bp.route('/article/update/<int:id>', methods=['GET', 'POST'])
@login_required
def update_article(id, **kwargs): 
  article = Article.get_one(id)
  if article is None:
    return jsonWrite('文章不存在', 201)
  if request.values.get('tags'):
    old_taglist = [item.id for item in article.tagList]
    new_taglist = request.values.get('tags').split(',')
    for item in new_taglist:
      if item not in old_taglist:
        tag = Tag.get_filter(id=item)
        article.add_tag(tag)
    for item in old_taglist:
      if str(item) not in new_taglist:
        tag = Tag.get_filter(id=item)
        article.remove_tag(tag)
  article.update(**request.values.to_dict())
  return jsonWrite('更新成功')


@bp.route('/article/delete/<int:id>', methods=['GET', 'POST'])
@login_required
def delete_article(id, **kwargs): 
  article = Article.get_one(id)
  if article is None:
    return jsonWrite('文章不存在', 201)
  article.update(status=-1)
  return jsonWrite('删除成功')