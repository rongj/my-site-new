# -*- coding: utf-8 -*-

from flask import request, g
from app.models import Category
from app.utils.res import jsonWrite
from app.utils.auth import login_required

from . import bp

@bp.route('/category/create', methods=['POST'])
def create_category(): 
  name = request.values.get('name')
  status = request.json.get('status', True)
  if name is None:
    return jsonWrite(None, 400)
  exist_category = Category.get_filter(name=name)
  if exist_category is not None:
    return jsonWrite('分类已存在', 201)
  new_category = Category(name=name, status=status)
  new_category.save()
  new_category.update(order_num=new_category.id)
  return jsonWrite()

@bp.route('/category/list', methods=['GET'])
def get_category_list(): 
  category_query = Category.query.order_by('order_num asc')
  getall = request.values.get('all', False)
  categories = category_query.all() if getall else category_query.filter_by(status=True).all()
  res = [item.to_dict() for item in categories]
  return jsonWrite(res)


@bp.route('/category/update/<int:id>', methods=['POST'])
def update_category(id, **kwargs): 
  category = Category.get_by_key(id)
  if category is None:
    return jsonWrite('分类不存在', 201)
  category.update(**request.json)
  return jsonWrite('更新成功')


@bp.route('/category/delete/<int:id>', methods=['GET'])
def delete_category(id, **kwargs): 
  category = category.get_by_key(id)
  if category is None:
    return jsonWrite('分类不存在', 201)
  category.update(status=False)
  return jsonWrite('删除成功')