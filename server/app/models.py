# -*- coding: utf-8 -*-

from datetime import datetime as dt
from .extensions import db

class BaseModel:
  def save(self):
    try:
      db.session.add(self)
      db.session.commit()
    except:
      db.session.rollback()

  @classmethod
  def create(cls, **kwargs):
    instance = cls(**kwargs)
    return instance.save()

  def update(self, **kwargs):
    for attr, value in kwargs.items():
      setattr(self, attr, value)
    if hasattr(self, 'updated_at'):
      self.updated_at = dt.now()
    return self.save()
  
  def delete(self):
    try:
      db.session.delete(self)
      db.session.commit()
    except:
      db.session.rollback()

  @classmethod
  def delete(cls, record_id):
    record = cls.query.get(record_id)
    try:
      db.session.delete(record)
      db.session.commit()
    except:
      db.session.rollback()

  @classmethod
  def get_one(cls, value, key='id'):
    return cls.query.filter('{}={}'.format(key, value)).first()


class Role(BaseModel, db.Model):
  __tablename__ = 'roles'

  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(64))
  status = db.Column(db.Boolean, default=False, index=True)
  role_id = db.Column(db.Integer, nullable=False)


class UserRole:
  USER = 1
  EDITOR = 2
  ADMIN = 3


class User(BaseModel, db.Model):
  __tablename__ = 'users'
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(64), index=True, unique=True, nullable=False)
  password = db.Column(db.String(128), nullable=False)
  email = db.Column(db.String(120), unique=True)
  phone = db.Column(db.String(16), unique=True)
  role = db.Column(db.Integer, index=True, default=UserRole.USER, nullable=False)
  created_at = db.Column(db.DateTime, nullable=False, default=dt.now)
  updated_at = db.Column(db.DateTime, nullable=False, default=dt.now)

  def to_dict(self):
    return dict(
      id = self.id,
      username = self.username,
      email = self.email,
      phone = self.phone,
      created_at = str(self.created_at),
    )


class ArticleStatus:
  ACTIVE = 0
  DRAFT = 1
  DELETED = 2


class Aricle(BaseModel, db.Model):
  __tablename__ = 'articles'
  id = db.Column(db.Integer, primary_key=True)
  title = db.Column(db.String(140), nullable=False)
  content = db.Column(db.Text)
  desc = db.Column(db.Text)
  cover = db.Column(db.String(256))
  status = db.Column(db.Integer, index=True, default=ArticleStatus.ACTIVE, nullable=False)
  created_at = db.Column(db.DateTime, nullable=False, default=dt.now)
  updated_at = db.Column(db.DateTime, nullable=False, default=dt.now)
  author_id = db.Column(db.Integer, db.ForeignKey('users.id'))

  def to_dict(self):
    return dict(
      id = self.id,
      title = self.title,
      content = self.content,
      desc = self.desc,
      cover = self.cover,
      author_id = self.author_id,
      username = self.user.name if self.user else None,
      created_at = str(self.created_at),
      updated_at = str(self.updated_at),
    )


class Category(BaseModel, db.Model):
  __tablename__ = 'categories'
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(16), nullable=False)
  order_num = db.Column(db.Integer)
  status = db.Column(db.Boolean, default=True)


class Plate(BaseModel, db.Model):
  __tablename__ = 'plates'
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(16), nullable=False)
  order_num = db.Column(db.Integer)
  status = db.Column(db.Boolean, default=True)
  category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))


class Tag(BaseModel, db.Model):
  __tablename__ = 'tags'
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(16))
  order_num = db.Column(db.Integer)
  status = db.Column(db.Boolean, default=True)


class CommentStatus:
  PASS = 0
  REVIEW = 1
  DENY = 2


class Comment(BaseModel, db.Model):
  __tablename__ = 'comments'
  id = db.Column(db.Integer, primary_key=True)
  content = db.Column(db.Text)
  status = db.Column(db.Integer, index=True, default=CommentStatus.PASS, nullable=False)
  created_at = db.Column(db.DateTime, nullable=False, default=dt.now)
  updated_at = db.Column(db.DateTime, nullable=False, default=dt.now)
  user_id = db.Column(db.Integer, db.ForeignKey('articles.id'), nullable=False)
  article_id = db.Column(db.Integer, db.ForeignKey('articles.id'), nullable=False)