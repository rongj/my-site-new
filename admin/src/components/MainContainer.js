import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Redirect } from 'react-router-dom';
import { Layout, Menu, Icon, Dropdown, LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import MainLayout from '@/components/MainLayout';
import '@/styles/layout.scss';

moment.locale('zh-cn');
const { Header } = Layout;

@withRouter
@inject('globalStore')
@observer
export default class extends Component {
  componentDidMount() {
    let { globalStore, location } = this.props;
    // if(globalStore.authLoading && location.pathname !== '/login') {
    //   globalStore.getAuth();
    // }
  }

  render() {
    let {
      children,
      location,
      globalStore,
      allRoutes
    } = this.props;

    let {
      user,
      authLoading,
      authMenus,
      authRoutes,
      handleLogout
    } = globalStore;
    
    // 单独视图
    if(['/login'].indexOf(location.pathname) > -1) {
      return <div>{children}</div>
    }

    // 如果没有home的权限则重定向到第一个权限菜单
    if(location.pathname === '/' && !authLoading && authRoutes.length) {
      return <Redirect to={authRoutes[0]} />
    }
    
    // 如果没有权限访问则跳到无权限页面
    if(authRoutes.indexOf(location.pathname) === -1 && !authLoading && allRoutes.indexOf(location.pathname) > -1) {
      return (
        <div className="page-error page-noauth">
          <h2>抱歉，您没有权限访问~</h2>
          <h3>Sorry, you don't have permission to visit.</h3>
        </div>
      )
    }

    let childrenLayout = children;
    // 菜单
    childrenLayout = <MainLayout dataSource={authMenus}>{children}</MainLayout>

    return (
      <LocaleProvider locale={zhCN}>
        <Layout className="main-wrapper">
          <Header className="main-header clearfix">
            <div className="main-header-logo">后台管理</div>
            <div className="main-header-right">
              <Dropdown 
                overlay={
                  <Menu>
                    <Menu.Item onClick={handleLogout}>退出</Menu.Item>
                  </Menu>
                }>
                <span className="ant-dropdown-link">
                  {user.realname} <Icon type="down" />
                </span>
              </Dropdown>
            </div>
          </Header>
          {childrenLayout}
        </Layout>
      </LocaleProvider>
    )

  }
}
