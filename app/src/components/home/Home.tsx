import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { UiStore } from '../../stores/UiStore';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { ContainersCard } from './cards/ContainersCard';
import { SystemCard } from './cards/SystemCard';
import { inject } from '../../utils/IOC';

@injectIntl
@observer
export class Home extends Component<{ intl: InjectedIntlProps }, {}> {
  @inject(UiStore)
  private uiStore: UiStore;

  componentWillMount() {
    const { formatMessage } = this.props.intl;
    this.uiStore.pageTitle = formatMessage({ id: 'home.title' });
  }

  render() {
    return (
      <div className="mdl-grid">
        <ContainersCard/>
        <SystemCard/>
      </div>
    );
  }
}
