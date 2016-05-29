import React, { Component } from 'react';
import { observer } from 'mobx-react/index';
import { SettingsStore } from '../../stores/SettingsStore';
import { ContainerStore } from '../../stores/ContainerStore';
import { MDLWrapper } from '../shared/MDLWrapper';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { UiStore } from '../../stores/UiStore';
import { NOTIFICATION_TYPE, Notification, NotificationStore } from '../../stores/NotificationStore';
import { inject } from '../../utils/IOC';
import { transaction, action } from 'mobx/lib/mobx';
import { ConnectionParametersModel, CONFIG_TYPE, PROTOCOL } from '../../models/ConnectionParametersModel';

const styles = require('./../shared/Common.css');

@injectIntl
@observer
export class Settings extends Component<{ intl: InjectedIntlProps }, {}> {
  @inject(SettingsStore)
  private settingsStore: SettingsStore;

  @inject(UiStore)
  private uiStore: UiStore;

  @inject(ContainerStore)
  private containerStore: ContainerStore;

  @inject(NotificationStore)
  private notificationStore: NotificationStore;

  @inject(ConnectionParametersModel)
  private connectionSettings: ConnectionParametersModel;

  componentWillMount (): void {
    const { formatMessage } = this.props.intl;
    this.uiStore.pageTitle = formatMessage({ id: 'settings.title' });

    transaction(() => {
      Object.assign(this.connectionSettings, this.settingsStore.connectionSettings);
    });
  }

  render () {
    return (
      <div className="mdl-grid">
        <div className="mdl-cell mdl-cell--12-col mdl-card mdl-shadow--4dp">
          <div className="mdl-card__supporting-text">
            <div className="mdl-grid">
              <div className="mdl-cell mdl-cell--2-col mdl-cell--4-phone">
                <FormattedMessage id="settings.config-type"/>
              </div>
              <div className="mdl-cell mdl-cell--10-col mdl-cell--4-phone">
                <ul className={`${styles.inlineList}`}>
                  <li>
                    <MDLWrapper>
                      <label className="mdl-radio mdl-js-radio mdl-js-ripple-effect" htmlFor="configType_host">
                        <input className="mdl-radio__button"
                               id="configType_host"
                               name="configType"
                               type="radio"
                               value={CONFIG_TYPE.HOST}
                               onChange={() => this.connectionSettings.configType = CONFIG_TYPE.HOST}
                               checked={this.connectionSettings.configType === CONFIG_TYPE.HOST}/>
                        <span className="mdl-radio__label">
                          <FormattedMessage id="settings.config-type.host"/>
                        </span>
                      </label>
                    </MDLWrapper>
                  </li>
                  <li>
                    <MDLWrapper>
                      <label className="mdl-radio mdl-js-radio mdl-js-ripple-effect" htmlFor="configType_socket">
                        <input className="mdl-radio__button"
                               id="configType_socket"
                               name="configType"
                               type="radio"
                               value={CONFIG_TYPE.SOCKET}
                               onChange={() => this.connectionSettings.configType = CONFIG_TYPE.SOCKET}
                               checked={this.connectionSettings.configType === CONFIG_TYPE.SOCKET}/>
                        <span className="mdl-radio__label">
                          <FormattedMessage id="settings.config-type.socket"/>
                        </span>
                      </label>
                    </MDLWrapper>
                  </li>
                </ul>
              </div>
            </div>
            {this.renderOptions()}
          </div>
          <div className={`mdl-card__actions mdl-card--border`}>
            <button className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                    onClick={this.submit}>
              <FormattedMessage id="settings.action.submit"/>
            </button>
          </div>
        </div>
      </div>
    );
  }

  private renderOptions () {
    if (this.connectionSettings.configType === CONFIG_TYPE.SOCKET) {
      return (
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--12-col">
            <MDLWrapper>
              <div
                className={`mdl-textfield mdl-js-textfield mdl-textfield--floating-label ${styles.fullWidthTextField}`}>
                <input className="mdl-textfield__input"
                       type="text"
                       id="socketPath"
                       onChange={(e: any) => this.connectionSettings.socketPath = e.target.value}
                       value={this.connectionSettings.socketPath}/>
                <label className="mdl-textfield__label" htmlFor="socketPath">
                  <FormattedMessage id="settings.socket-path"/>
                </label>
              </div>
            </MDLWrapper>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--12-col">
              <MDLWrapper>
                <div
                  className={`mdl-textfield mdl-js-textfield mdl-textfield--floating-label ${styles.fullWidthTextField}`}>
                  <input className="mdl-textfield__input"
                         type="text"
                         id="host"
                         onChange={(e: any) => this.connectionSettings.host = e.target.value}
                         value={this.connectionSettings.host}/>
                  <label className="mdl-textfield__label" htmlFor="host">
                    <FormattedMessage id="settings.host"/>
                  </label>
                </div>
              </MDLWrapper>
            </div>
          </div>

          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--12-col">
              <MDLWrapper>
                <div
                  className={`mdl-textfield mdl-js-textfield mdl-textfield--floating-label ${styles.fullWidthTextField}`}>
                  <input className="mdl-textfield__input"
                         type="text"
                         pattern="-?[0-9]*(\.[0-9]+)?"
                         id="port"
                         onChange={(e: any) => this.connectionSettings.port = e.target.value}
                         value={this.connectionSettings.port}/>
                  <label className="mdl-textfield__label" htmlFor="port">
                    <FormattedMessage id="settings.port"/>
                  </label>
                  <span className="mdl-textfield__error">
                    <FormattedMessage id="settings.port.not-a-number"/>
                  </span>
                </div>
              </MDLWrapper>
            </div>
          </div>

          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--2-col mdl-cell--4-phone">
              <FormattedMessage id="settings.protocol"/>
            </div>
            <div className="mdl-cell mdl-cell--10-col mdl-cell--4-phone">
              <ul className={`${styles.inlineList}`}>
                <li>
                  <MDLWrapper>
                    <label className="mdl-radio mdl-js-radio mdl-js-ripple-effect"
                           htmlFor="protocol_http">
                      <input className="mdl-radio__button"
                             id="protocol_http"
                             name="protocol"
                             type="radio"
                             value={PROTOCOL.HTTP}
                             onChange={() => this.connectionSettings.protocol = PROTOCOL.HTTP}
                             checked={this.connectionSettings.protocol === PROTOCOL.HTTP}/>
                      <span className="mdl-radio__label">
                        <FormattedMessage id="settings.protocol.http"/>
                      </span>
                    </label>
                  </MDLWrapper>
                </li>
                <li>
                  <MDLWrapper>
                    <label className="mdl-radio mdl-js-radio mdl-js-ripple-effect"
                           htmlFor="protocol_https">
                      <input className="mdl-radio__button"
                             id="protocol_https"
                             name="protocol"
                             type="radio"
                             value={PROTOCOL.HTTPS}
                             onChange={() => this.connectionSettings.protocol = PROTOCOL.HTTPS}
                             checked={this.connectionSettings.protocol === PROTOCOL.HTTPS}/>
                      <span className="mdl-radio__label">
                        <FormattedMessage id="settings.protocol.https"/>
                      </span>
                    </label>
                  </MDLWrapper>
                </li>
              </ul>
            </div>
          </div>

          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--12-col">
              <MDLWrapper>
                <div
                  className={`mdl-textfield mdl-js-textfield mdl-textfield--floating-label ${styles.fullWidthTextField}`}>
                  <input className="mdl-textfield__input"
                         type="text"
                         id="caFile"
                         onChange={(e: any) => this.connectionSettings.caFile = e.target.value}
                         value={this.connectionSettings.caFile}/>
                  <label className="mdl-textfield__label" htmlFor="caFile">
                    <FormattedMessage id="settings.ca-file"/>
                  </label>
                </div>
              </MDLWrapper>
            </div>
          </div>

          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--12-col">
              <MDLWrapper>
                <div
                  className={`mdl-textfield mdl-js-textfield mdl-textfield--floating-label ${styles.fullWidthTextField}`}>
                  <input className="mdl-textfield__input"
                         type="text"
                         id="certFile"
                         onChange={(e: any) => this.connectionSettings.certFile = e.target.value}
                         value={this.connectionSettings.certFile}/>
                  <label className="mdl-textfield__label" htmlFor="certFile">
                    <FormattedMessage id="settings.cert-file"/>
                  </label>
                </div>
              </MDLWrapper>
            </div>
          </div>

          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--12-col">
              <MDLWrapper>
                <div
                  className={`mdl-textfield mdl-js-textfield mdl-textfield--floating-label ${styles.fullWidthTextField}`}>
                  <input className="mdl-textfield__input"
                         type="text"
                         id="keyFile"
                         onChange={(e: any) => this.connectionSettings.keyFile = e.target.value}
                         value={this.connectionSettings.keyFile}/>
                  <label className="mdl-textfield__label" htmlFor="keyFile">
                    <FormattedMessage id="settings.key-file"/>
                  </label>
                </div>
              </MDLWrapper>
            </div>
          </div>
        </div>
      );
    }
  }

  @action
  private submit = async () => {
    const { formatMessage } = this.props.intl;

    transaction(() => {
      Object.assign(this.settingsStore.connectionSettings, this.connectionSettings);
    });

    try {
      await this.containerStore.loadContainers();

      const notification: Notification = {
        type: NOTIFICATION_TYPE.SUCCESS,
        message: formatMessage({ id: 'settings.valid-connection' }),
        timeout: 2000
      };

      this.notificationStore.notifications.push(notification);
    } catch (e) {
      const notification: Notification = {
        type: NOTIFICATION_TYPE.ERROR,
        message: e.message,
        timeout: 2000
      };

      this.notificationStore.notifications.push(notification);
    }
  };
}
