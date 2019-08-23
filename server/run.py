# -*- coding: utf-8 -*-
from app.main import create_app

app = create_app('DEVELOPMENT')

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=9090)