import { observable, action } from 'mobx';
import api from '@/services/api';
import message from '@/utils/message';
import { filterHtmlTags } from '@/utils/tools';

class articleFormStore {
  @observable
  tagList = []

  @observable
  categoryList = []
  
  @observable
  formData = {}

  @observable
  submitLoding = false

  @action
  getArticleDetail = id => {
    api.getArticleDetail({id}).then(res => {
      if(res.code === 200) {
        let d = res.data || {};
        let params = {
          id: d.id,
          title: d.title,
          category_id: d.category_id,
          tag_id: d.tags.map(l => l.id+''),
          summary: d.summary,
          content: d.content,
          edit_content: d.edit_content,
          cover: d.cover,
          status: d.status
        }
        this.formData = params;
        this.defaultForm = params;
      }
    })
  }

  @action
  getTagList = () => {
    api.getTagList({ showAll: false }).then(res => {
      if(res.code === 200) {
        this.tagList = res.data || [];
      }
    })
  }

  @action
  getCategoryList = () => {
    api.getCategoryList({ showAll: false }).then(res => {
      if(res.code === 200) {
        this.categoryList = res.data || [];
      }
    })
  }

  @action
  uploadImg = (uploadFile, type) => {
    let param = new FormData();
    param.append('name', type);
    param.append('uploadFile', uploadFile);
    return api.uploadImg(param).then(res => {
      if(res.code === 200) {
        return res.data
      }
    })
  }

  @action
  putArticle = (submitType, type, html, md) => {
    let apiUrl = type === 'update' ? 'updateArticle' : 'createArticle';    
    let {
      id,
      title,
      category_id,
      tag_id,
      summary,
      cover,
    } = this.formData;

    if(!title || !html || !category_id || !tag_id || !tag_id.length) {
      message.error('参数不能为空')
      return;
    }

    let tags = this.formData.tag_id.join(',')

    if(!summary) {
      summary = filterHtmlTags(html).substr(0, 100)
    }

    let status = submitType === 'draft' ? 0 : 1;

    let params = {
      id,
      title,
      category_id,
      tags,
      summary,
      content: html,
      edit_content: md,
      cover,
      status
    }

    console.log(apiUrl)
    console.log(params)

    this.submitLoding = true;
    return api[apiUrl](params).then(res => {
      this.submitLoding = false;
      if(res.code === 200) {
        message.success(type === 'update' ? '更新成功' : '新增成功');
        this.getData();
        return true;
      } else {
        message.error(res.msg);
      }
    }).catch(e => {
      this.submitLoding = false;
    })
  }

}

export default new articleFormStore();