import React, { Component } from 'react';
import { UiStore } from '../../stores/UiStore';
import { observer } from 'mobx-react/index';
import { MDLWrapper } from '../shared/MDLWrapper';
import { inject } from '../../utils/IOC';
import { SettingsStore } from '../../stores/SettingsStore';
import { UpdateNotifications } from './UpdateNoifications';

@observer
export class Header extends Component<void, {}> {
  @inject(SettingsStore)
  private settingsStore: SettingsStore;

  @inject(UiStore)
  private uiStore: UiStore;

  render () {
    return (
      <header className="mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__header-row">
          <span className="mdl-layout-title">{this.uiStore.pageTitle}</span>
          <div className="mdl-layout-spacer"></div>


          {this.renderSpinner()}
          {this.renderUpdateNotifications()}

          {/*<div
           className="mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right">
           <label className="mdl-button mdl-js-button mdl-button--icon"
           htmlFor="fixed-header-drawer-exp">
           <i className="material-icons">search</i>
           </label>
           <div className="mdl-textfield__expandable-holder">
           <input className="mdl-textfield__input" type="text" name="sample"
           id="fixed-header-drawer-exp"/>
           </div>
           </div>*/}
        </div>
      </header>
    );
  }

  private renderSpinner () {
    if (!this.uiStore.isLoading) {
      return null;
    }

    return (
      <span>
        <MDLWrapper>
          <div className="mdl-spinner mdl-js-spinner is-active"></div>
        </MDLWrapper>
      </span>
    );
  }

  private renderUpdateNotifications () {
    if (!this.settingsStore.showUpdateNotifications) {
      return null;
    }

    return (
      <span style={{ marginLeft: '16px' }}>
        <UpdateNotifications/>
      </span>
    );
  }
}
