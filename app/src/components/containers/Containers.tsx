import React, { Component } from 'react';
import { observer } from 'mobx-react/index';
import { FormattedMessage, FormattedRelative, InjectedIntlProps, injectIntl } from 'react-intl';
import { UiStore } from '../../stores/UiStore';
import { observable, computed } from 'mobx/lib/mobx';
import { Link } from 'react-router';
import { ContainerStore } from '../../stores/ContainerStore';
import { CONTAINER_RUN_STATE, CONTAINER_STATE } from '../../models/ContainerModel';
import { inject } from '../../utils/IOC';

const styles = require('./../shared/Common.css');

interface ContainersProps {
  intl: InjectedIntlProps;
  location: {
    query: {
      showAll?: string
    }
  }
}

@injectIntl
@observer
export class Containers extends Component<ContainersProps, {}> {
  @inject(UiStore)
  private uiStore: UiStore;

  @inject(ContainerStore)
  private containerStore: ContainerStore;

  @observable
  private showAllContainers: boolean = false;

  @computed
  private get containers () {
    return this.containerStore.containers.values();
  }

  @computed
  private get runningContainers () {
    return this.containers.filter(container => container.state.runState === CONTAINER_RUN_STATE.RUNNING);
  }

  async componentWillMount () {
    const { formatMessage } = this.props.intl;
    this.uiStore.pageTitle = formatMessage({ id: 'containers.title' });

    this.setFilter(this.props);

    await this.loadContainers();
  }

  render () {
    let containers = this.containers;

    if (!this.showAllContainers) {
      containers = this.runningContainers;
    }

    return (
      <div>
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--12-col mdl-card mdl-shadow--4dp" style={{ minHeight: '0px' }}>
            <div className="mdl-card__supporting-text">
              <ul className={`${styles.inlineList}`}>
                <li>
                  <label>
                    <input type="checkbox"
                           checked={this.showAllContainers}
                           onChange={this.changeFilter}/>
                    <FormattedMessage id='containers.filter.showAll'/>
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--12-col">
            <table
              className={`mdl-data-table mdl-js-data-table mdl-shadow--2dp ${styles.fullWidthTable} ${styles.fixedLayoutTable}`}>
              <thead>
              <tr>
                <th className="mdl-data-table__cell--non-numeric">
                  <FormattedMessage
                    id='containers.th.id'/>
                </th>
                <th className={`mdl-data-table__cell--non-numeric`}>
                  <FormattedMessage
                    id='containers.th.image'/>
                </th>
                <th className="mdl-data-table__cell--non-numeric">
                  <FormattedMessage
                    id='containers.th.command'/>
                </th>
                <th className="mdl-data-table__cell--non-numeric">
                  <FormattedMessage
                    id='containers.th.created'/>
                  { ' ' }/{ ' ' }
                  <FormattedMessage
                    id='containers.th.status'/>
                </th>
                <th className="mdl-data-table__cell--non-numeric">
                  <FormattedMessage
                    id='containers.th.ports'/>
                </th>
                <th className="mdl-data-table__cell--non-numeric">
                  <FormattedMessage
                    id='containers.th.name'/>
                </th>
              </tr>
              </thead>
              <tbody>
              {
                containers.map(container => (
                  <tr key={container.id}>
                    <td className="mdl-data-table__cell--non-numeric">
                      <Link to={`/containers/${container.id}`}>{container.id.substr(0, 12) }</Link>
                    </td>
                    <td className={`mdl-data-table__cell--non-numeric ${styles.wrap}`}>
                        <span className="mdl-typography--body-1">
                          {container.image}
                        </span>
                    </td>
                    <td className={`mdl-data-table__cell--non-numeric ${styles.wrap}`}>
                      <ul className={styles.unstyledList}>
                        { container.cmd.map((cmd, index) => (
                          <li key={index}>
                              <span className="mdl-typography--body-1">
                                {cmd}
                              </span>
                          </li>
                        )) }
                      </ul>
                    </td>
                    <td className={`mdl-data-table__cell--non-numeric ${styles.wrap}`}>
                      <FormattedRelative value={container.created.getTime() }/>
                      { ' ' }/{ ' ' }
                      <FormattedMessage
                        id={`containers.state.${CONTAINER_STATE[container.state.state]}`}/>
                      { ' ' }
                      { container.state.state !== CONTAINER_STATE.CREATED ? <FormattedRelative
                        value={container.state.state === CONTAINER_STATE.RUNNING ? container.state.startedAt.getTime() : container.state.finishedAt.getTime() }/> : null}
                    </td>
                    <td className={`mdl-data-table__cell--non-numeric ${styles.wrap}`}>
                      {container.ports.map(port => {
                        let mapping = `${port[ 0 ].port}/${port[ 0 ].protocol}`;

                        if (port[ 1 ] != null) {
                          mapping += ` -> ${port[ 1 ].ip}:${port[ 1 ].port}/${port[ 0 ].protocol}`;
                        }

                        return mapping
                      }).join(', ')}
                    </td>
                    <td
                      className={`mdl-data-table__cell--non-numeric ${styles.wrap}`}>{container.node != null ? `${container.node.name}/${container.name}` : container.name}</td>
                  </tr>
                ))
              }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  private setFilter (props: ContainersProps) {
    const { query } = props.location;

    if (query.showAll != null) {
      this.showAllContainers = true;
    }
  }

  private async loadContainers () {
    const finishTask = this.uiStore.startAsyncTask();

    try {
      await this.containerStore.loadContainers();
      finishTask();
    } catch (e) {
      finishTask(e);
    }
  }

  private changeFilter = () => {
    this.showAllContainers = !this.showAllContainers;
  };
}
