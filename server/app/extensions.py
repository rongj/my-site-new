# -*- coding: utf-8 -*-

from flask_bcrypt import Bcrypt
from flask_caching import Cache
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

bcrypt = Bcrypt()
db = SQLAlchemy()
cache = Cache()
cors = CORS()