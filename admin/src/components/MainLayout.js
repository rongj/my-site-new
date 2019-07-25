import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';

const { Sider } = Layout;
const { SubMenu }  = Menu;

@withRouter
export default class extends Component {
  handleMenuChange = ({ key }) => {
    this.props.history.push(key);
  }
  
  render() {
    let {
      children,
      location,
      dataSource = [],
    } = this.props;
    
    return (
      <Layout className="main-layout">
        <div className="main-layout-left">
          <div className="left-menus">
            <Sider
              className="main-sider"
              width={240}>
              <Menu
                mode="inline"
                className="main-menu scrollbar"
                defaultSelectedKeys={[location.pathname]}
                defaultOpenKeys={['/'+location.pathname.split('/')[1]]}
                onClick={this.handleMenuChange}>
                <SubMenu
                  key="/user"
                  title={
                    <span>
                      <Icon type="bars" />
                      <span>用户管理</span>
                    </span>
                  }>
                  <Menu.Item key="/user/list">所有用户</Menu.Item>
                  <Menu.Item key="/user/create">添加用户</Menu.Item>
                </SubMenu>
                <Menu.Item key="/category">文章分类</Menu.Item>
                <Menu.Item key="/tag">文章标签</Menu.Item>
                <SubMenu
                  key="/article"
                  title={
                    <span>
                      <Icon type="bars" />
                      <span>文章管理</span>
                    </span>
                  }>
                  <Menu.Item key="/article/list">文章列表</Menu.Item>
                  <Menu.Item key="/article/create">添加文章</Menu.Item>
                </SubMenu>
 
                <Menu.Item key="/log">日志管理</Menu.Item>
                <Menu.Item key="/tool">工具管理</Menu.Item>
                <Menu.Item key="/case">代码案例</Menu.Item>
              </Menu>
            </Sider>
          </div>
        </div>
        <Layout className="main-content scrollbar scrollbar-lg">
          { children }
        </Layout>
      </Layout>
    )
  }
}
