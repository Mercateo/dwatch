import React from 'react';
import { observer } from 'mobx-react/index';
import { AutoRefreshComponent } from '../shared/AutoRefreshComponent';
import { observable } from 'mobx/lib/mobx';
import { UiStore } from '../../stores/UiStore';
import { TopModel } from '../../utils/DockerFacade';
import { MDLWrapper } from '../shared/MDLWrapper';
import { FormattedMessage } from 'react-intl';
import { ContainerModel, CONTAINER_RUN_STATE } from '../../models/ContainerModel';
import { inject } from '../../utils/IOC';

const styles = require('./../shared/Common.css');

@observer
export class Top extends AutoRefreshComponent<{container: ContainerModel}, {}> {
  @inject(UiStore)
  private uiStore: UiStore;

  @observable
  private topData: TopModel = null;

  render () {
    if (this.props.container != null && this.props.container.state.runState === CONTAINER_RUN_STATE.RUNNING && this.topData != null) {
      return (
        <MDLWrapper>
          <table
            className={`mdl-data-table mdl-js-data-table mdl-shadow--2dp ${styles.fullWidthTable} ${styles.fixedLayoutTable}`}>
            <thead>
            <tr className="mdl-data-table__cell--non-numeric">
              {this.topData.Titles != null ? this.topData.Titles.map((title, index) => (
                <th key={index}>{title}</th>
              )) : null}
            </tr>
            </thead>
            <tbody>
            {this.topData.Processes != null ? this.topData.Processes.map((process, index) => (
              <tr className={`mdl-data-table__cell--non-numeric ${styles.wrap}`} key={index}>
                {process.map((field, index) => (
                  <td key={index}>{field}</td>
                ))}
              </tr>
            )) : null}
            </tbody>
          </table>
        </MDLWrapper>
      );
    } else {
      return (
        <table
          className={`mdl-data-table mdl-shadow--2dp ${styles.fullWidthTable}`}>
          <tbody>
          <tr>
            <td style={{ textAlign: 'center' }}><FormattedMessage id="no-data-available"/></td>
          </tr>
          </tbody>
        </table>
      );
    }
  }

  async tick (): Promise<void> {
    await this.loadTopData();
  }

  private async loadTopData () {
    const finishTask = this.uiStore.startAsyncTask();

    try {
      if (this.props.container != null && this.props.container.state.runState === CONTAINER_RUN_STATE.RUNNING) {
        this.topData = await this.props.container.top();
      } else {
        this.topData = null;
      }
      finishTask();
    } catch (e) {
      finishTask(e);
    }
  }
}
