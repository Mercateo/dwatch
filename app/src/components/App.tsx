import React, { Component } from 'react';
import { Header } from './site/Header';
import { AppDrawer } from './site/AppDrawer';
import { MDLWrapper } from './shared/MDLWrapper';

const styles = require('./App.css');

export class App extends Component<{}, {}> {
  render () {
    return (
      <MDLWrapper>
        <div className={`${styles.demoLayout} mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header`}>
          <Header/>
          <AppDrawer/>
          <main className="mdl-layout__content mdl-color--grey-100">
            <div className="page-content">
              {this.props.children}
            </div>
          </main>
        </div>
      </MDLWrapper>
    );
  }
}
