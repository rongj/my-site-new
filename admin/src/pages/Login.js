import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Input, Button } from 'antd';
import '@/styles/login.scss';

@Form.create({ name: 'login' })
@inject(stores => ({ inStore: stores.loginStore }))
@observer
export default class extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.inStore.handleLogin(values);
      }
    })
  }

  render() {    
    const { getFieldDecorator } = this.props.form;
    const { submitLoading } = this.props.inStore;
    
    return (
      <div className="login-page">
        <div className="login-panel">
          <div className="login-header">管理后台登录</div>
          <div className="login-content">
            <Form onSubmit={this.handleSubmit} className="login-form">
              <Form.Item>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: '用户名不能为空' }],
                })(
                  <Input
                    size="large"
                    placeholder="用户名"/>
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '密码不能为空' }],
                })(
                  <Input
                    size="large"
                    type="password"
                    placeholder="请输入密码"/>
                )}
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  size="large"
                  type="primary"
                  className="mt10"
                  htmlType="submit"
                  loading={submitLoading}>登录</Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}