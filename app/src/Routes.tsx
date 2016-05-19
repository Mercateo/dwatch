import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { Home } from './components/home/Home';
import { Containers } from './components/containers/Containers';
import { App } from './components/App';
import { Container } from './components/container/Container';
import { Settings } from './components/settings/Settings';

export default (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="settings" component={Settings}/>
      <Route path="containers" component={Containers}/>
      <Route path="containers/:containerId" component={Container}/>
    </Route>
  </Router>
);
