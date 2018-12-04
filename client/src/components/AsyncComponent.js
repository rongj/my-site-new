import React, {Component} from 'react';

import { inject, observer } from 'mobx-react';

@inject('appStore')
@observer
export const asyncComponent = (loadComponent, requireAuth) => (
	class extends Component {
		state = {
			Component: null,
		}

		componentWillMount() {
			if (this.hasLoadedComponent()) {
				return;
			}

			loadComponent()
				.then(module => module.default)
				.then((Component) => {
					this.setState({ Component });
					let { uid } = this.props.appStore.user;
					if(requireAuth && !uid) {
						this.props.history.replace('/login');
					}
				})
				.catch((err) => {
					console.error(`Cannot load component in <AsyncComponent />`);
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