import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
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
    } = this.props;
    
    return (
      <Layout className="main-layout">
        <div className="main-layout-left">
          <div className="left-menus">
            <Sider
              className="main-sider"
              width={160}>
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
                      <Icon type="user" />
                      <span>用户管理</span>
                    </span>
                  }>
                  <Menu.Item key="/user/list">所有用户</Menu.Item>
                  <Menu.Item key="/user/create">添加用户</Menu.Item>
                </SubMenu>
                <Menu.Item key="/category">
                  <Icon type="appstore" />
                  <span>文章分类</span>
                </Menu.Item>
                <Menu.Item key="/tag">
                  <Icon type="tags" />
                  <span>文章标签</span>
                </Menu.Item>
                <SubMenu
                  key="/article"
                  title={
                    <span>
                      <Icon type="read" />
                      <span>文章管理</span>
                    </span>
                  }>
                  <Menu.Item key="/article/list">文章列表</Menu.Item>
                  <Menu.Item key="/article/create">添加文章</Menu.Item>
                </SubMenu>
 
                <Menu.Item key="/log">
                  <Icon type="profile" />
                  <span>日志管理</span>
                </Menu.Item>
                <Menu.Item key="/tool">
                  <Icon type="tool" />
                  <span>工具管理</span>
                </Menu.Item>
                <Menu.Item key="/case">
                  <Icon type="project" />
                  <span>案例管理</span>
                </Menu.Item>
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
