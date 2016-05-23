import React, { Component } from 'react';
import { LocaleSwitcher } from './LocaleSwitcher';
import { FormattedMessage } from 'react-intl';
import { shell } from 'electron';

declare var __VERSION__: any;

const styles = require('./../App.css');

export class AppDrawer extends Component<void, {}> {
  render () {
    return (
      <div className="mdl-layout__drawer mdl-color--blue-grey-900 mdl-color-text--blue-grey-50">
        <span className="mdl-layout-title">
          DWatch
        </span>
        <nav className={`mdl-navigation mdl-color--blue-grey-800 ${styles.demoNavigation}`}>
          <a className={`${styles.navigationLink} mdl-navigation__link`} href="#/">
            <i className={`${styles.navigationIcon} mdl-color-text--blue-grey-400 material-icons`}
               role="presentation">dashboard</i>
            <FormattedMessage id="home.title"/>
          </a>
          <a className={`${styles.navigationLink} mdl-navigation__link`} href="#/containers">
            <i className={`${styles.navigationIcon} mdl-color-text--blue-grey-400 material-icons`}
               role="presentation">card_travel</i>
            <FormattedMessage id="containers.title"/>
          </a>
          <a className={`${styles.navigationLink} mdl-navigation__link`} href="#/images">
            <i className={`${styles.navigationIcon} mdl-color-text--blue-grey-400 material-icons`}
               role="presentation">assignment</i>
            <FormattedMessage id="images.title"/>
          </a>
          {/*<a className={`${styles.navigationLink} mdl-navigation__link`} href="#/images">Images</a>
          <a className={`${styles.navigationLink} mdl-navigation__link`} href="#/networks">
            <i className={`${styles.navigationIcon} mdl-color-text--blue-grey-400 material-icons`}
               role="presentation">dvr</i>Networks</a>*/}
          <a className={`${styles.navigationLink} mdl-navigation__link`} href="#/settings">
            <i className={`${styles.navigationIcon} mdl-color-text--blue-grey-400 material-icons`}
               role="presentation">settings</i>
            <FormattedMessage id="settings.title"/>
          </a>
          <div className="mdl-layout-spacer"></div>
          <LocaleSwitcher/>
          {/*<a className={`${styles.navigationLink} mdl-navigation__link`} href="">
            <i className={`${styles.navigationIcon} mdl-color-text--blue-grey-400 material-icons`}
               role="presentation">help_outline</i></a>*/}
          <span className="mdl-typography--text-center mdl-typography--font-light" style={{ cursor: 'pointer' }}>
            DWatch @ <a onClick={this.openGithubRepo}>Github</a> | v{__VERSION__}
          </span>
        </nav>
      </div>
    );
  }

  private openGithubRepo = () => {
    shell.openExternal('https://github.com/Mercateo/dwatch');
  }
}
