import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Redirect } from 'react-router-dom';
import { Layout, Menu, Icon, Dropdown, LocaleProvider } from 'antd';
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
  }

  render() {
    let {
      children,
      location,
      globalStore,
    } = this.props;

    let {
      user,
      handleLogout
    } = globalStore;
    
    // 单独视图
    if(['/login'].indexOf(location.pathname) > -1) {
      return <div>{children}</div>
    }

    let childrenLayout = children;
    // 菜单
    childrenLayout = <MainLayout>{children}</MainLayout>

    return (
      <LocaleProvider locale={zhCN}>
        <Layout className="main-wrapper">
          <Header className="main-header clearfix">
            <div className="main-header-logo">后台管理系统</div>
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
