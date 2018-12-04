import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';


// @inject('appStore')

@withRouter
@observer
export default class Container extends Component {
	render() {
		let { children } = this.props;

		return (
			<div className="wrapper">
				<div className="container">
					{children}
				</div>
			</div>
		)
	}
}