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
                {
                  dataSource.map((item, i) => {
                    return item.subPermission && item.subPermission.length ?
                    <SubMenu
                      key={item.modelpage || (item.subPermission[0].modelpage && '/'+item.subPermission[0].modelpage.split('/')[1])}
                      title={
                        <span>
                          <Icon type="bars" />
                          <span>{item.permission_name}</span>
                        </span>
                      }>
                      {
                        item.subPermission.map((subitem, ii) => 
                          <Menu.Item key={subitem.modelpage || i + '_' + ii}>{subitem.permission_name}</Menu.Item>
                        )
                      }
                    </SubMenu> :
                    <Menu.Item key={item.modelpage}>{item.permission_name}</Menu.Item>
                  })
                }
                {/* <SubMenu
                  key="/app"
                  title={
                    <span>
                      <Icon type="bars" />
                      <span>APP数据统计</span>
                    </span>
                  }>
                  <Menu.Item key="/app/active">APP每日活跃数据</Menu.Item>
                  <Menu.Item key="/app/qid">APP每日渠道版本数据</Menu.Item>
                </SubMenu>
                <SubMenu
                  key="/eastday"
                  title={
                    <span>
                      <Icon type="bars" />
                      <span>东方网审核后台</span>
                    </span>
                  }>
                  <Menu.Item key="/eastday/newscheck">新闻审核首页</Menu.Item>
                </SubMenu>
                <SubMenu
                  key="/video"
                  title={
                    <span>
                      <Icon type="bars" />
                      <span>视频审核监控(外包)</span>
                    </span>
                  }>
                  <Menu.Item key="/video/outsource">视频审核监控(外包)</Menu.Item>
                  <Menu.Item key="/video/outmanage">视频审核监控(外包管理)</Menu.Item>
                  <Menu.Item key="/video/time">视频审核监控-分时</Menu.Item>
                </SubMenu>
                <SubMenu
                  key="/news"
                  title={
                    <span>
                      <Icon type="bars" />
                      <span>新闻审核监控(外包)</span>
                    </span>
                  }>
                  <Menu.Item key="/news/outsource">新闻审核监控(外包)</Menu.Item>
                  <Menu.Item key="/news/outmanage">新闻审核监控(外包管理)</Menu.Item>
                </SubMenu>
                 */}
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
