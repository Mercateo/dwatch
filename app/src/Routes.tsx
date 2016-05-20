import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { Home } from './components/home/Home';
import { Containers } from './components/containers/Containers';
import { App } from './components/App';
import { Container } from './components/container/Container';
import { Settings } from './components/settings/Settings';
import { Images } from './components/images/Images';
import { Image } from './components/image/Image';

export default (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="settings" component={Settings}/>
      <Route path="containers" component={Containers}/>
      <Route path="containers/:containerId" component={Container}/>
      <Route path="images" component={Images}/>
      <Route path="images/:imageId" component={Image}/>
    </Route>
  </Router>
);
