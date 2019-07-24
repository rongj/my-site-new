import React, { Component } from 'react';
import { Form, Input, Select, DatePicker } from 'antd';

const { Option } = Select;

export default class extends Component {
  render() {
    return (
      <div className="page-toolbar">
        <Form className="page-toolbar-form" layout="inline">
          <Form.Item label="渠道号">
            <Input 
              placeholder="输入渠道号(选填)" />
          </Form.Item>
          <Form.Item label="版本名称">
            <Input 
              placeholder="输入版本名称" />
          </Form.Item>
          <Form.Item label="操作系统名称">
            <Select 
              value={"all"}>
              <Option key="all">全部</Option>
              <Option key="android">Android</Option>
              <Option key="ios">IOS</Option>
            </Select>
          </Form.Item>
          <Form.Item label="软件名称">
            <Select 
              value={"TouTiao"}>
              <Option key="TouTiao">TouTiao</Option>
            </Select>
          </Form.Item>
          <Form.Item label="日期">
            <DatePicker />
          </Form.Item>
        </Form>
      </div>
    )
  }
}