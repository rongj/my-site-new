import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router } from 'react-router';
import { createHashHistory } from 'history';
import stores from '@/stores/index';
import {asyncComponent } from '@/components/AsyncComponent';
import MainContainer from '@/components/MainContainer';

export const routingStore = new RouterStore();
export const history = syncHistoryWithStore(createHashHistory(), routingStore);

export const routes = [
  {
    path: '/article/list',
    component: () => import(/* webpackChunkName: "article-list" */  '@/pages/Article'),
  },
  {
    path: '/article/create',
    component: () => import(/* webpackChunkName: "article-create" */  '@/pages/ArticleCreate'),
  },
  {
    path: '/category',
    component: () => import(/* webpackChunkName: "category" */  '@/pages/Category'),
  },
  {
    path: '/tag',
    component: () => import(/* webpackChunkName: "tag" */  '@/pages/Tag'),
  },
  {
    path: '/user/list',
    component: () => import(/* webpackChunkName: "user-list" */  '@/pages/User'),
  },
  {
    path: '/user/create',
    component: () => import(/* webpackChunkName: "user-create" */  '@/pages/UserCreate'),
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */  '@/pages/Login'),
    notRequireAuth: true,
  },
];

const allRoutes = routes.map(l => l.path);

export const store = {
  routingStore,
  ...stores
};

export default () => {
  return (
    <Provider {...store}>
      <Router history={history}>
        <MainContainer allRoutes={allRoutes}>
          <Switch>
            {
              routes.map(item => 
                <Route
                  exact
                  path={item.path}
                  key={item.path}
                  component={asyncComponent(item.component, item.notRequireAuth)} />
              )
            }
            <Redirect from="/" to="/article/list" />
          </Switch>
        </MainContainer>
      </Router>
    </Provider>
  )
}