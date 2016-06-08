import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { CONTAINER_RUN_STATE } from '../../../models/ContainerModel';
import { computed } from 'mobx/lib/mobx';
import { ContainerStore } from '../../../stores/ContainerStore';
import { inject } from '../../../utils/IOC';
import { UiStore } from '../../../stores/UiStore';
import { observer } from 'mobx-react/index';

const styles = require('./../../shared/Common.css');

@injectIntl
@observer
export class ContainersCard extends Component<void, {}> {
  @inject(UiStore)
  private uiStore: UiStore;

  @inject(ContainerStore)
  private containerStore: ContainerStore;

  @computed
  private get containers() {
    return this.containerStore.containers.values();
  }

  @computed
  private get runningContainers() {
    return this.containers.filter(container => container.state.runState === CONTAINER_RUN_STATE.RUNNING);
  }

  async componentWillMount() {
    const finishTask = this.uiStore.startAsyncTask();

    try {
      await this.containerStore.loadContainers();
      finishTask();
    } catch (e) {
      finishTask(e);
    }
  }

  render () {
    return (
      <div className="mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--4dp" style={{ minHeight: '0px' }}>
        <div className="mdl-card__title">
          <h2 className="mdl-card__title-text">
            <FormattedMessage id="containers"/>
          </h2>
        </div>
        <div className="mdl-card__supporting-text">
          <p><FormattedMessage id="home.containers.supportingText"/></p>
        </div>
        <div className="mdl-layout-spacer"></div>
        <div className={`mdl-card__actions ${styles.flexActionBar} mdl-card--border`}>
          <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect right" href="#/containers?showAll=true">
            <FormattedMessage id="home.containers.all" values={{ count: this.containers.length }}/>
          </a>
          <div className="mdl-layout-spacer"></div>
          <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href="#/containers">
            <FormattedMessage id="home.containers.running" values={{ count: this.runningContainers.length }}/>
          </a>
        </div>
      </div>
    );
  }
}
