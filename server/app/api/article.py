# -*- coding: utf-8 -*-

from flask import request, g
from app.models import Article, Tag
from app.utils.res import jsonWrite
from app.utils.auth import login_required, admin_required

from . import bp

@bp.route('/article/create', methods=['POST'])
@login_required
@admin_required
def create_article(): 
  user_id = g.current_user.get('id') if g.get('current_user') else None
  title = request.json.get('title')
  content = request.json.get('content')
  edit_content = request.json.get('edit_content')
  summary = request.json.get('summary')
  cover = request.json.get('cover')
  category_id = request.json.get('category_id')
  tags = request.json.get('tags')
  status = request.json.get('status', 1)
  if not all([title, content, category_id, tags]):
    return jsonWrite(None, 400)
  new_article = Article(user_id=user_id, title=title, content=content, category_id=category_id, edit_content=edit_content, summary=summary, status=status)
  for item in tags.split(','):
    tag = Tag.get_filter(id=item)
    if not tag:
      new_tag = Tag(name=item, status=True)
      new_tag.save()
      new_tag.update(order_num=new_tag.id)
      new_article.add_tag(new_tag)
    else:
      new_article.add_tag(tag)
  new_article.save()
  return jsonWrite()


@bp.route('/article/list', methods=['GET'])
def get_article_list(): 
  page = request.values.get('page', 1)
  pageSize = request.values.get('pageSize', 10)
  category_id = request.values.get('category_id', None)
  tag_id = request.values.get('tag_id', None)
  status = request.values.get('status', 1)
  article_query = Article.query.filter_by(status=status).order_by('created_at desc')
  if category_id:
    article_query = article_query.filter_by(category_id=category_id)
  if tag_id:
    article_query = article_query.filter(Article.tagList.any(Tag.id == tag_id))
  articles = article_query.offset(int(pageSize)*(int(page)-1)).limit(pageSize).all()
  total = article_query.count()
  res = [item.to_dict_list() for item in articles]
  return jsonWrite({ 'list': res, 'total': total, 'page': int(page), 'pageSize': int(pageSize) })


@bp.route('/article/archive', methods=['GET'])
def get_article_archive(): 
  article_query = Article.query.filter_by(status=1).order_by('created_at desc').all()
  res = {}
  for item in article_query:
    key = item.created_at.year
    if not res.get(key):
      res[key] = { 'list': [], 'count': 0 }
    res[key]['list'].append({ 'date': str(item.created_at.month) + '-' + str(item.created_at.day), 'title': item.title, 'id': item.id })
    res[key]['count'] = len(res[key]['list'])
  return jsonWrite(res)


@bp.route('/article/<int:id>', methods=['GET'])
def get_article(id): 
  article = Article.get_by_key(id)
  if article is None:
    return jsonWrite('文章不存在', 201)
  return jsonWrite(article.to_dict())


@bp.route('/article/update/<int:id>', methods=['POST'])
@login_required
@admin_required
def update_article(id, **kwargs): 
  user_id = g.current_user.get('id') if g.get('current_user') else None
  article = Article.get_by_key(id)
  if article is None:
    return jsonWrite('文章不存在', 201)
  if request.json.get('tags'):
    old_taglist = [item.id for item in article.tagList]
    new_taglist = request.json.get('tags').split(',')
    for item in new_taglist:
      if item not in old_taglist:
        tag = Tag.get_filter(id=item)
        article.add_tag(tag)
    for item in old_taglist:
      if str(item) not in new_taglist:
        tag = Tag.get_filter(id=item)
        article.remove_tag(tag)
  article.update(**request.json)
  return jsonWrite('更新成功')


@bp.route('/article/delete/<int:id>', methods=['GET', 'POST'])
@login_required
@admin_required
def delete_article(id, **kwargs): 
  article = Article.get_by_key(id)
  if article is None:
    return jsonWrite('文章不存在', 201)
  article.update(status=-1)
  return jsonWrite('删除成功')