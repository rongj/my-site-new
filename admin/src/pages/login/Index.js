import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Input, Icon, Button } from 'antd';
import './style.scss';

@inject('loginStore')
@observer
export default class extends Component {
  // 表单修改
  handleFormChange = (type, e) => this.props.loginStore.setLoginForm(type,  e.target.value)

  render() {
    let { loginStore } = this.props;
    let { loginForm, handleLogin, ableSubmit } = loginStore;

    return (
      <div className="login-panel">
        <Form>
          <Form.Item>
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入用户名"
              value={loginForm.uname}
              onChange={this.handleFormChange.bind(null, 'uname')}/>
          </Form.Item>
          <Form.Item>
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入用户名"
              type="password"
              value={loginForm.pwd}
              onChange={this.handleFormChange.bind(null, 'pwd')}/>
          </Form.Item>
          <Form.Item>
            <Button
              loading={!ableSubmit}
              type="primary"
              htmlType="submit"
              onClick={handleLogin}>登录</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}