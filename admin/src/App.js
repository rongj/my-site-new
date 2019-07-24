import React from 'react';
import { Switch, Route } from 'react-router-dom';
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
    path: '/',
    component: () => import(/* webpackChunkName: "app-active" */  '@/pages/Index'),
    notRequireAuth: true,
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */  '@/pages/login/Index'),
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
          </Switch>
        </MainContainer>
      </Router>
    </Provider>
  )
}