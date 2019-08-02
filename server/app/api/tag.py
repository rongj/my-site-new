# -*- coding: utf-8 -*-

from flask import request, g
from app.models import Tag
from app.utils.res import jsonWrite
from app.utils.auth import login_required

from . import bp

@bp.route('/tag/create', methods=['POST'])
def create_tag(): 
  name = request.json.get('name')
  status = request.json.get('status', True)
  if name is None:
    return jsonWrite(None, 400)
  exist_tag = Tag.get_filter(name=name)
  if exist_tag is not None:
    return jsonWrite('标签已存在', 201)
  new_tag = Tag(name=name, status=status)
  new_tag.save()
  new_tag.update(order_num=new_tag.id)
  return jsonWrite()


@bp.route('/tag/list', methods=['GET'])
def get_tag_list(): 
  tag_query = Tag.query.order_by('order_num asc')
  getall = request.values.get('all', False)
  tags = tag_query.all() if getall else tag_query.filter_by(status=True).all()
  res = [item.to_dict() for item in tags]
  return jsonWrite(res)


@bp.route('/tag/update/<int:id>', methods=['POST'])
def update_tag(id, **kwargs): 
  tag = Tag.get_by_key(id)
  if tag is None:
    return jsonWrite('标签不存在', 201)
  tag.update(**request.json)
  return jsonWrite('更新成功')


@bp.route('/tag/delete/<int:id>', methods=['GET'])
def delete_tag(id, **kwargs): 
  tag = Tag.get_by_key(id)
  if tag is None:
    return jsonWrite('标签不存在', 201)
  tag.delete()
  return jsonWrite('删除成功')