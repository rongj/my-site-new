# -*- coding: utf-8 -*-

from flask import request, g
from app.models import Category
from app.utils.res import jsonWrite
from app.utils.auth import login_required

from . import bp

@bp.route('/category/create', methods=['POST'])
def create_category(): 
  name = request.values.get('name')
  if name is None:
    return jsonWrite(None, 400)
  exist_category = Category.get_filter(name=name)
  if exist_category is not None:
    return jsonWrite('分类已存在', 201)
  new_category = Category(name=name)
  new_category.save()
  new_category.update(order_num=new_category.id)
  return jsonWrite()


@bp.route('/category/list', methods=['GET'])
def get_category_list(): 
  categories = Category.query.filter_by(status=True).order_by('order_num asc').all()
  res = [item.to_dict() for item in categories]
  return jsonWrite(res)


@bp.route('/category/update/<int:id>', methods=['GET', 'POST'])
def update_category(id, **kwargs): 
  category = Category.get_one(id)
  if category is None:
    return jsonWrite('分类不存在', 201)
  category.update(**request.values.to_dict())
  return jsonWrite('更新成功')


@bp.route('/category/delete/<int:id>', methods=['GET', 'POST'])
def delete_category(id, **kwargs): 
  category = category.get_one(id)
  if category is None:
    return jsonWrite('分类不存在', 201)
  category.update(status=False)
  return jsonWrite('删除成功')