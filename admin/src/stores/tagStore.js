import { observable, action } from 'mobx';
import api from '@/services/api';
import message from '@/utils/message';

class tagStore {
  @observable
  listLoading = false
  
  @observable
  listData = []

  @observable
  formData = {}

  @observable
  submitLoding = false

  @action
  getData = (showAll = true) => {
    this.listLoading = true;
    api.getTagList({ showAll }).then(res => {
      this.listLoading = false;
      if(res.code === 200) {
        this.listData = res.data || [];
      }
    }).catch(e => {
      this.listLoading = false;
    })
  }

  @action
  deleteItem = (id) => {
    api.deleteTag({ id }).then(res => {
      if(res.code === 200) {
        message.success('删除成功');
        this.getData();
      }
    })
  }

  @action
  putItem = (type) => {
    this.submitLoding = true;
    let apiUrl = type === 'update' ? 'updateTag' : 'createTag';
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

export default new tagStore();