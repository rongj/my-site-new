import { observable, action } from 'mobx';
import api from '@/services/api';
import message from '@/utils/message';

class articleStore {
  @observable
  listLoading = false
  
  @observable
  listData = []

  @observable
  tagList = []

  @observable
  categoryList = []
  
  @observable
  formData = {
    page: 1,
    pageSize: 20,
    category_id: '',
    tag_id: '',
    status: 1
  }

  @observable
  submitLoding = false

  @action
  getData = () => {
    this.listLoading = true;
    api.getArticleList(this.formData).then(res => {
      this.listLoading = false;
      if(res.code === 200 && res.data) {
        this.listData = res.data.list || [];
      }
    }).catch(e => {
      this.listLoading = false;
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
  deleteItem = (id) => {
    api.deleteCategory({ id }).then(res => {
      if(res.code === 200) {
        message.success('删除成功');
        this.getData();
      }
    })
  }

  @action
  putItem = (type) => {
    this.submitLoding = true;
    let apiUrl = type === 'update' ? 'updateCategory' : 'createCategory';
    return api[apiUrl](this.formData).then(res => {
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

export default new articleStore();