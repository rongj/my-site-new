# -*- coding: utf-8 -*-

from flask_bcrypt import Bcrypt
from flask_caching import Cache
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

bcrypt = Bcrypt()
db = SQLAlchemy()
cache = Cache()
cors = CORS()
jwt = JWTManager()


from .utils.jwt import jwt_identity, identity_loader

jwt.user_loader_callback_loader(jwt_identity)
jwt.user_identity_loader(identity_loader)