import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'mobx-react';

import stores from './stores/index.js';

import Container from './pages/Container';
import { asyncComponent } from './components/AsyncComponent';

window._____APP_STATE_____ = stores;


const routes = [
	{
		path: '/',
		component: () => import('./pages/Home'),
	}
];


export default () => {
	return (
		<Provider {...stores}>
			<Router>
				<Container>
					<Switch>
						{
							routes.map(item => 
								<Route exact path={item.path} key={item.path} component={asyncComponent(item.component, item.requireAuth)} />
							)
						}
						<Route exact path="/home" render={()=><Redirect to="/"/>}/>
					</Switch>
				</Container>
			</Router>
		</Provider>
	)
}