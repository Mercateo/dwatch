/// <reference path="../../node_modules/inversify-dts/inversify/inversify.d.ts" />
/// <reference path="../../node_modules/inversify-dts/inversify-binding-decorators/inversify-binding-decorators.d.ts" />
/// <reference path="../../node_modules/inversify-dts/inversify-inject-decorators/inversify-inject-decorators.d.ts" />

import 'source-map-support/register';
import 'babel-polyfill';
import 'reflect-metadata';
import 'material-design-lite/material.min.css';
import 'material-design-lite/material.min.js';
import 'material-design-lite/dist/material.cyan-light_blue.min.css';
import 'flag-icon-css/css/flag-icon.min.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider, addLocaleData } from 'react-intl';
import { messages } from './i18n';
import Routes from './Routes';
import { hashHistory } from 'react-router';
import DevTools from 'mobx-react-devtools';
import { observer } from 'mobx-react/index';
import { Notifications } from './components/shared/Notifications';
import { inject } from './utils/IOC';
import { SettingsStore } from './stores/SettingsStore';
import { DockerSystemStore } from './stores/DockerSystemStore';
import { parseLocale } from './utils/Helper';

addLocaleData(require('react-intl/locale-data/de'));

declare var __DEVELOP__: boolean;

@observer
class AppContainer extends Component<{}, {}> {
  @inject(SettingsStore)
  private settingsStore: SettingsStore;

  @inject(DockerSystemStore)
  private dockerSystemStore: DockerSystemStore;

  componentWillMount (): void {
    // test connectivity
    this.dockerSystemStore
        .loadVersion()
        .catch(() => {
          hashHistory.replace('/settings');
        });
  }

  render () {
    let locale = parseLocale(this.settingsStore.locale);

    return (
      <IntlProvider locale={locale.language} messages={messages[locale.fullLocale]}>
        {Routes}
      </IntlProvider>
    );
  }
}

ReactDOM.render(
  <div>
    <AppContainer/>
    <Notifications/>
    { __DEVELOP__ ? <DevTools/> : null }
  </div>,
  document.getElementById('root')
);
