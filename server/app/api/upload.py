# -*- coding: utf-8 -*-

import os
import uuid
from flask import request, g, current_app, send_from_directory, url_for
from werkzeug.utils import secure_filename
from PIL import Image
from app.utils.res import jsonWrite
from app.utils.auth import login_required

from . import bp

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'JPG', 'PNG', 'gif', 'GIF'])

def allowed_file(filename):
  return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

def get_imgsize(size, img_ratio = 16/9):
  origin_ratio = size[0]/size[1]
  box = ()
  if origin_ratio > img_ratio: 
    cropx = (size[0] - size[1]*img_ratio)/2
    box = (cropx, 0, size[1]*img_ratio + cropx, size[1])
  else:
    cropy = (size[1] - size[0]/img_ratio)/2
    box = (0, cropy, size[0], size[0]/img_ratio + cropy)
  return box


@bp.route('/', methods=['GET'])
def index():
  return 'Hello Flask Api'

@bp.route('/upload', methods=['POST'])
def upload(): 
  f_type = request.values.get('name', '')
  if not f_type:
    return jsonWrite('上传类型不能为空', 201)
  file_dir = os.path.join(os.getcwd(), current_app.config['UPLOAD_FOLDER'], f_type)
  print(file_dir)
  if not os.path.exists(file_dir):
    os.makedirs(file_dir)
  f = request.files.get('uploadFile', None)
  if not f:
    return jsonWrite('缺少参数', 201)
  if not allowed_file(f.filename):
    return jsonWrite('文件格式不合法', 201)
  im = Image.open(f)
  crop_im = im
  if f_type == 'cover':
    box = get_imgsize(im.size)
    crop_im = im.crop(box)
  elif f_type == 'avatar':
    box = get_imgsize(im.size, 1)
    crop_im = im.crop(box)
    crop_im.thumbnail((100,100))

  fname = secure_filename(f.filename)
  ext = fname.rsplit('.', 1)[1]
  uid = uuid.uuid3(uuid.NAMESPACE_DNS, fname)
  new_filename = ''.join(str(uid).split('-')) + '.' + ext
  print(os.path.join(file_dir, new_filename))
  crop_im.save(os.path.join(file_dir, new_filename))
  uploaded_path = os.path.join(current_app.config['UPLOAD_FOLDER'], f_type, new_filename).replace('\\','/')
  full_path = current_app.config['UPLOAD_URL'] + os.path.join(f_type, new_filename).replace('\\','/')
  return jsonWrite({'fileName': new_filename, 'filePath': uploaded_path, 'fullFilePath': full_path})
