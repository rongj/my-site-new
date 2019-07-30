# -*- coding: utf-8 -*-

from datetime import datetime as dt
from .extensions import db, bcrypt

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

  @classmethod
  def get_filter(cls, **kwargs):
    return cls.query.filter_by(**kwargs).first()


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
  articles = db.relationship('Article', backref='author')
  comments = db.relationship('Comment', backref='author')
  userinfo = db.relationship('UserInfo', backref='user', uselist=False)
  token = db.Column(db.String(300))
  
  def to_dict(self):
    return dict(
      id = self.id,
      username = self.username,
      email = self.email,
      phone = self.phone,
      created_at = str(self.created_at),
    )

  @classmethod
  def set_password(cls, password):
    return bcrypt.generate_password_hash(password)

  def check_password(self, value):
    return bcrypt.check_password_hash(self.password, value)


class UserInfo(BaseModel, db.Model):
  __tablename__ = 'userinfos'
  id = db.Column(db.Integer, primary_key=True)
  qq = db.Column(db.String(16), unique=True)
  wechart = db.Column(db.String(16), unique=True)
  weibo = db.Column(db.String(16), unique=True)
  zfb = db.Column(db.String(16), unique=True)
  github = db.Column(db.String(16), unique=True)
  user_id = db.Column(db.Integer, db.ForeignKey('users.id'))


class ArticleStatus:
  DRAFT = 0
  ACTIVE = 1
  DELETED = -1


article_tag = db.Table(
  'article_tag',
  db.Column('article_id', db.Integer, db.ForeignKey('articles.id')),
  db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'))
)


class Article(BaseModel, db.Model):
  __tablename__ = 'articles'
  id = db.Column(db.Integer, primary_key=True)
  title = db.Column(db.String(140), nullable=False)
  content = db.Column(db.Text)
  edit_content = db.Column(db.Text)
  summary = db.Column(db.Text)
  cover = db.Column(db.String(256))
  status = db.Column(db.Integer, index=True, default=ArticleStatus.ACTIVE, nullable=False)
  created_at = db.Column(db.DateTime, nullable=False, default=dt.now)
  updated_at = db.Column(db.DateTime, nullable=False, default=dt.now)
  user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
  category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
  tagList = db.relationship('Tag', secondary=article_tag, backref='articles')
  comments = db.relationship('Comment', backref=db.backref('article'), lazy='dynamic')

  def to_dict_list(self):
    return dict(
      id = self.id,
      title = self.title,
      summary = self.summary,
      cover = self.cover,
      user_id = self.user_id,
      username = self.author.username if self.author else None,
      category_id = self.category_id,
      category_name = self.category.name if self.category else None,
      tags = [item.to_dict() for item in self.tagList],
      created_at = str(self.created_at),
      updated_at = str(self.updated_at),
    )

  def to_dict(self):
    return dict(
      id = self.id,
      title = self.title,
      content = self.content,
      edit_content = self.edit_content,
      summary = self.summary,
      cover = self.cover,
      user_id = self.user_id,
      username = self.author.username if self.author else None,
      category_id = self.category_id,
      category_name = self.category.name if self.category else None,
      tags = [item.to_dict() for item in self.tagList],
      created_at = str(self.created_at),
      updated_at = str(self.updated_at),
    )
  
  def add_tag(self, tag):
    if tag not in self.tagList:
      self.tagList.append(tag)
      return True
    return False

  def remove_tag(self, tag):
    if tag in self.tagList:
      self.tagList.remove(tag)
      return True
    return False

  
class Category(BaseModel, db.Model):
  __tablename__ = 'categories'
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(16), index=True, unique=True, nullable=False)
  order_num = db.Column(db.Integer)
  status = db.Column(db.Boolean, default=True)
  articles = db.relationship('Article', backref='category')

  def to_dict(self):
    return dict(
      id = self.id,
      name = self.name,
      order_num = self.order_num,
      article_num = len(self.articles)
    )


class Tag(BaseModel, db.Model):
  __tablename__ = 'tags'
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(16), index=True, unique=True, nullable=False)
  order_num = db.Column(db.Integer)
  status = db.Column(db.Boolean, default=True)

  def to_dict(self):
    return dict(
      id = self.id,
      name = self.name,
      order_num = self.order_num,
      article_num = len(self.articles)
    )


class CommentStatus:
  DELETE = -1
  REVIEW = 0
  PASS = 1
  DENY = 2


class Comment(BaseModel, db.Model):
  __tablename__ = 'comments'
  id = db.Column(db.Integer, primary_key=True)
  content = db.Column(db.Text)
  status = db.Column(db.Integer, index=True, default=CommentStatus.PASS, nullable=False)
  created_at = db.Column(db.DateTime, nullable=False, default=dt.now)
  updated_at = db.Column(db.DateTime, nullable=False, default=dt.now)
  article_id = db.Column(db.Integer, db.ForeignKey('articles.id'), nullable=False)
  user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
  refer_id = db.Column(db.Integer, db.ForeignKey('comments.id'))

  def to_dict(self):
    return dict(
      id = self.id,
      content = self.content,
      created_at = str(self.created_at),
      user_id = self.user_id,
      username = self.author.username if self.author else None,
      refer_id = self.refer_id,
    )