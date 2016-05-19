import React, { Component } from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { inject } from '../../../utils/IOC';
import { DockerSystemStore } from '../../../stores/DockerSystemStore';
import { observer } from 'mobx-react/index';
import { UiStore } from '../../../stores/UiStore';

const styles = require('./../../shared/Common.css');

@observer
export class SystemCard extends Component<void, {}> {
  @inject(UiStore)
  private uiStore: UiStore;

  @inject(DockerSystemStore)
  private dockerSystemStore: DockerSystemStore;

  async componentWillMount () {
    const finishTask = this.uiStore.startAsyncTask();

    try {
      await this.dockerSystemStore.loadVersion();
      finishTask();
    } catch (e) {
      finishTask(e);
    }
  }

  render () {
    const { version } = this.dockerSystemStore;

    if (version != null) {
      return (
        <div className="mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--4dp"
             style={{ minHeight: '0px' }}>
          <div className="mdl-card__title">
            <h2 className="mdl-card__title-text">
              <FormattedMessage id="home.system"/>
            </h2>
          </div>
          <div className="mdl-card__supporting-text">
            <ul className={`${styles.inlineList}`}>
              <li><FormattedMessage id="home.system.server-version"/></li>
              <li>
                <strong>
                  {version.Version}
                </strong>
              </li>
            </ul>

            <ul className={`${styles.inlineList}`}>
              <li><FormattedMessage id="home.system.os"/></li>
              <li>
                <strong>
                  {version.Os}
                </strong>
              </li>
            </ul>

            <ul className={`${styles.inlineList}`}>
              <li><FormattedMessage id="home.system.kernel-version"/></li>
              <li>
                <strong>
                  {version.KernelVersion}
                </strong>
              </li>
            </ul>

            <ul className={`${styles.inlineList}`}>
              <li><FormattedMessage id="home.system.go-version"/></li>
              <li>
                <strong>
                  {version.GoVersion}
                </strong>
              </li>
            </ul>

            <ul className={`${styles.inlineList}`}>
              <li><FormattedMessage id="home.system.arch"/></li>
              <li>
                <strong>
                  {version.Arch}
                </strong>
              </li>
            </ul>

            <ul className={`${styles.inlineList}`}>
              <li><FormattedMessage id="home.system.api-version"/></li>
              <li>
                <strong>
                  {version.ApiVersion}
                </strong>
              </li>
            </ul>

            <ul className={`${styles.inlineList}`}>
              <li><FormattedMessage id="home.system.build-time"/></li>
              <li>
                <strong>
                  <FormattedDate value={version.BuildTime}/>
                </strong>
              </li>
            </ul>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}
