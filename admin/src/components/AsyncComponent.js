import React, {Component} from 'react';

import { inject, observer } from 'mobx-react';

@inject('globalStore')
@observer
export const asyncComponent = (loadComponent, notRequireAuth) => (
  class extends Component {
    state = {
      Component: null
    }

    componentWillMount() {
      if (this.hasLoadedComponent()) {
        return;
      }

      loadComponent()
        .then(module => module.default)
        .then((Component) => {
          this.setState({ Component });
          let { history, globalStore } = this.props;
          let { user, clearUserData } = globalStore;
          // if(!notRequireAuth && !user.token) {
          //   history.push('/login');
          //   clearUserData();
          // }
        })
        .catch((err) => {
          console.error('Cannot load component in <AsyncComponent />');
          throw err;
        });

    }

    hasLoadedComponent() {
      return this.state.Component !== null;
    }

    render() {
      const { Component } = this.state;
      return (Component) ? <Component {...this.props} /> : null;
    }
  }
);