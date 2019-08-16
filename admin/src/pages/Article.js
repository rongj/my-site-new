import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Form, Select, Radio, Tag, Divider, Popconfirm } from 'antd';
import TableLayout from '@/components/TableLayout';

const { Option } = Select;

@inject(stores => ({ inStore: stores.articleStore }))
@observer
export default class extends Component {
  componentDidMount() {
    const { inStore } = this.props;
    inStore.getData();
    inStore.getTagList();
    inStore.getCategoryList();
  }
  
  onFormChange = (k, v) => {
    const { inStore } = this.props;
    inStore.formData[k] = v;
    inStore.getData();
  }
  
  render() {
    const { inStore } = this.props;
    const {
      formData,
      tagList,
      categoryList,
      listLoading,
      listData,
      deleteItem,
      putItem,
    } = inStore;

    const columns = [
      {
        dataIndex: 'title',
        title: '标题',
        align: 'left',
      },
      {
        dataIndex: 'category_name',
        title: '分类',
        align: 'left',
      },
      {
        dataIndex: 'tags',
        title: '标签',
        align: 'left',
        render: text => <span>{
          text.map(l => <Tag key={l.id}>{l.name}</Tag>)
        }</span>
      },
      {
        dataIndex: 'action',
        title: '操作',
        align: 'left',
        render: (text, record) => <span>
          <Link to={'/article/update/' + record.id}>编辑</Link>
          <Divider type="vertical"/>
          {
            record.status === 0 &&
            <Fragment>
              <Popconfirm
                title="确定删除？"
                onConfirm={() => deleteItem(record.id)}>
                <a>删除</a>
              </Popconfirm>
              <Divider type="vertical"/>
              <Popconfirm
                title="确定发布？"
                onConfirm={() => putItem(record.id)}>
                <a>发布</a>
              </Popconfirm>
            </Fragment>
          }
          {
            record.status === 1 &&
            <Popconfirm
              title="确定删除？"
              onConfirm={() => deleteItem(record.id)}>
              <a>删除</a>
            </Popconfirm>
          }
          {
            record.status === -1 &&
            <Popconfirm
              title="确定发布？"
              onConfirm={() => putItem(record.id)}>
              <a>发布</a>
            </Popconfirm>
          }
        </span>
      },
    ];
    
    return (
      <Fragment>
        <div className="page-toolbar mb10">
          <Form className="page-toolbar-form" layout="inline">
            <Form.Item label="文章状态">
              <Radio.Group 
                value={formData.status}
                onChange={e => this.onFormChange('status', e.target.value)}
                buttonStyle="solid">
                <Radio.Button value={1}>发布中</Radio.Button>
                <Radio.Button value={0}>草稿箱</Radio.Button>
                <Radio.Button value={-1}>已删除</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="文章分类">
              <Select
                showSearch
                optionFilterProp="children"
                value={formData.category_id}
                dropdownMatchSelectWidth={false}
                onChange={v => this.onFormChange('category_id', v)}>
                <Option value=''>全部</Option>
                {
                  categoryList.map(l => 
                    <Option key={l.id} value={l.id}>{l.name}</Option>
                  )
                }
              </Select>
            </Form.Item>
            <Form.Item label="文章标签">
              <Select
                showSearch
                optionFilterProp="children"
                value={formData.tag_id}
                dropdownMatchSelectWidth={false}
                onChange={v => this.onFormChange('tag_id', v)}>
                <Option value=''>全部</Option>
                {
                  tagList.map(l => 
                    <Option key={l.id} value={l.id}>{l.name}</Option>
                  )
                }
              </Select>
            </Form.Item>
          </Form>
        </div>
        <TableLayout
          loading={listLoading}
          columns={columns}
          dataSource={listData}/>
      </Fragment>
    )
  }
}