import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import '../styles/home.scss';

export default class Home extends Component {

	render() {
		return (
			<div className="body-fullwidth">
				Home
			</div>
		)
	}
}