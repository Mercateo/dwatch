import React, { Component } from 'react';
import { observer } from 'mobx-react/index';
import { observable, computed, autorun } from 'mobx/lib/mobx';
import { UiStore } from '../../stores/UiStore';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { hashHistory } from 'react-router';
import { ContainerCard } from './cards/ContainerCard';
import { DetailCard } from './cards/DetailCard';
import { NetworkCard } from './cards/NetworkCard';
import { LiveFeedCard } from './cards/LiveFeedCard';
import { StatsCard } from './cards/StatsCard';
import { ContainerStore } from '../../stores/ContainerStore';
import { ContainerModel } from '../../models/ContainerModel';
import { NodeCard } from './cards/NodeCard';
import { inject } from '../../utils/IOC';

interface ContainerProps {
  intl: InjectedIntlProps;
  params: {
    containerId: string
  };
}

@injectIntl
@observer
export class Container extends Component<ContainerProps, {}> {
  private pageTitleDisposer;

  @inject(UiStore)
  private uiStore: UiStore;

  @inject(ContainerStore)
  private containerStore: ContainerStore;

  @observable
  private containerId: string;

  @computed
  private get container (): ContainerModel {
    return this.containerStore.containers.get(this.containerId);
  }

  async componentWillMount () {
    const { containerId } = this.props.params;
    const { formatMessage } = this.props.intl;

    this.containerId = containerId;

    await this.loadContainer(containerId);

    this.pageTitleDisposer = autorun(() => {
      if (this.container != null) {
        this.uiStore.pageTitle = formatMessage({ id: 'container.title' }, { name: this.container.name });
      }
    });
  }

  async componentWillReceiveProps (nextProps: ContainerProps) {
    if (nextProps.params.containerId !== this.props.params.containerId) {
      this.containerId = nextProps.params.containerId;
      await this.loadContainer(nextProps.params.containerId);
    }
  }

  componentWillUnmount (): any {
    if (this.pageTitleDisposer != null) {
      this.pageTitleDisposer();
    }
  }

  render () {
    if (this.container == null) {
      return null;
    }

    return (
      <div>
        <div className="mdl-grid">
          <ContainerCard container={this.container}/>

          <StatsCard container={this.container}/>

          <DetailCard container={this.container}/>

          <NodeCard container={this.container}/>

          <NetworkCard container={this.container}/>

          <LiveFeedCard container={this.container}/>
        </div>
      </div>
    );
  }

  private async loadContainer (containerId: string) {
    const finishTask = this.uiStore.startAsyncTask();

    try {
      await this.containerStore.loadContainer(containerId);
      finishTask();
    } catch (e) {
      hashHistory.replace('/containers');
      finishTask(e);
    }
  }
}
