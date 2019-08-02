import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Input, Switch, Button, Divider, Popconfirm, Modal } from 'antd';
import TableLayout from '@/components/TableLayout';


@inject(stores => ({ inStore: stores.categoryStore }))
@observer
export default class extends Component {
  state = {
    showModal: false,
    modalType: 'create'
  }
  
  componentDidMount() {
    this.props.inStore.getData();
  }

  onModelToggle = (type, item) => {
    const { inStore } = this.props;
    this.setState({
      showModal: true,
      modalType: type
    });
    inStore.formData = type === 'update' ? item : { status: true };
  }

  onFormChange = (k, v) => {
    const { inStore } = this.props;
    inStore.formData[k] = v;
  }

  onModelChange = type => {
    if(type === 'ok') {
      const { inStore } = this.props;
      const { modalType } = this.state;
      inStore.putItem(modalType).then(res => {
        if(res) {
          this.setState({ showModal: false });
        }
      })
    } else {
      this.setState({ showModal: false });
    }
  }
  
  render() {

    const { inStore } = this.props;
    const {
      listData,
      listLoading,
      formData,
      submitLoding,
      deleteItem,
    } = inStore;

    const {
      showModal,
      modalType
    } = this.state;

    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '分类',
        dataIndex: 'name',
      },
      {
        title: '文章数',
        dataIndex: 'article_num',
      },
      {
        title: '分类状态',
        dataIndex: 'status',
        render: text => text ? '启用' : '禁用'
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => <span>
          <a onClick={this.onModelToggle.bind(null, 'update', record)}>编辑</a>
          <Divider type="vertical"/>
          <Popconfirm
            title="确定删除这条分类?"
            onConfirm={() => deleteItem(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </span>
      }
    ];
    
    return (
      <Fragment>
        <div className="mb10">
          <Button
            type="primary"
            onClick={this.onModelToggle.bind(null, 'create')}>新增分类</Button>
        </div>
        <TableLayout
          loading={listLoading}
          columns={columns}
          dataSource={listData}/>
        <Modal
          visible={showModal}
          title={modalType === 'update' ? '编辑分类' : '新增分类'}
          centered
          confirmLoading={submitLoding}
          onOk={this.onModelChange.bind(null, 'ok')}
          onCancel={this.onModelChange.bind(null, 'cancel')}>
          <Form className="form-flex">
            <Form.Item label="分类名称" required>
              <Input 
                value={formData.name}
                onChange={e => this.onFormChange('name', e.target.value)}
                placeholder="输入分类名"/>
            </Form.Item>
            <Form.Item label="分类状态">
            <Switch
              checkedChildren="ON"
              unCheckedChildren="OFF"
              checked={formData.status}
              onChange={v => this.onFormChange('status', v)}/>
            </Form.Item>
            <Form.Item label="分类排序">
              <Input
                value={formData.order_num}
                onChange={e => this.onFormChange('order_num', e.target.value)}
                type="number"/>
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    )
  }
}