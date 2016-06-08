import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { MDLWrapper } from '../../shared/MDLWrapper';
import { AsyncButton } from '../../shared/AsyncButton';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { ContainerModel, CONTAINER_RUN_STATE } from '../../../models/ContainerModel';
import { ContainerStore } from '../../../stores/ContainerStore';
import { observer } from 'mobx-react/index';
import { inject } from '../../../utils/IOC';
import { TwoColumnCardRow } from '../../shared/TwoColumnCardRow';

const styles = require('./../../shared/Common.css');

@observer
export class ContainerCard extends Component<{container: ContainerModel}, {}> {
  @inject(ContainerStore)
  private containerStore: ContainerStore;

  render () {
    const { container } = this.props;

    return (
      <div
        className="mdl-cell mdl-cell--6-col mdl-cell--4-col-tablet mdl-cell--8-col-phone mdl-card mdl-shadow--4dp">
        <div className="mdl-card__title mdl-card--border">
          <h2 className="mdl-card__title-text">
            <FormattedMessage id="container.header"/>
          </h2>
        </div>
        <div className="mdl-card__supporting-text">
          <TwoColumnCardRow besides={true}
                            left={
                               <div>
                                 <TwoColumnCardRow left={<FormattedMessage id="containers.th.id"/>}
                                                   right={<strong>{container.id.substr(0, 12) }</strong>}/>
          
                                 <TwoColumnCardRow left={<FormattedMessage id="containers.th.name"/>}
                                                   right={<strong>{container.name}</strong>}/>
          
                                 <TwoColumnCardRow left={<FormattedMessage id="containers.th.created"/>}
                                                   right={<strong><FormattedRelative value={container.created.getTime()}/></strong>}/>
                               </div>
                            }
                            right={
                               <div>
                                 <TwoColumnCardRow left={<FormattedMessage id="containers.th.status"/>}
                                                   right={<strong>{CONTAINER_RUN_STATE[ container.state.runState ]}</strong>}/>
          
                                 <TwoColumnCardRow left={<FormattedMessage id="containers.th.image"/>}
                                                   right={<strong>{container.image}</strong>}/>
                              </div>
                            }/>
        </div>
        <div className={`mdl-card__actions ${styles.flexActionBar} mdl-card--border`}>
          {this.renderStartStopButton() }
          {this.renderPauseUnpauseButton() }
          <MDLWrapper>
            <AsyncButton
              className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
              disabled={container.state.runState !== CONTAINER_RUN_STATE.STOPPED}
              onClick={this.handleRemoveClick}>
              <FormattedMessage id="container.action.remove"/>
            </AsyncButton>
          </MDLWrapper>
        </div>
      </div>
    );
  }

  private renderStartStopButton () {
    const { container } = this.props;
    if (container.state.runState === CONTAINER_RUN_STATE.RUNNING) {
      return (
        <MDLWrapper>
          <AsyncButton
            className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
            onClick={this.handleStopClick}>
            <FormattedMessage id="container.action.stop"/>
          </AsyncButton>
        </MDLWrapper>
      );
    } else if (container.state.runState === CONTAINER_RUN_STATE.STOPPED) {
      return (
        <MDLWrapper>
          <AsyncButton
            className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
            onClick={this.handleStartClick}>
            <FormattedMessage id="container.action.start"/>
          </AsyncButton>
        </MDLWrapper>
      );
    } else {
      return null;
    }
  }

  private renderPauseUnpauseButton () {
    const { container } = this.props;
    if (container.state.runState === CONTAINER_RUN_STATE.RUNNING) {
      return (
        <MDLWrapper>
          <AsyncButton
            className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
            onClick={this.handlePauseClick}>
            <FormattedMessage id="container.action.pause"/>
          </AsyncButton>
        </MDLWrapper>
      );
    } else if (container.state.runState === CONTAINER_RUN_STATE.PAUSED) {
      return (
        <MDLWrapper>
          <AsyncButton
            className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
            onClick={this.handleUnPauseClick}>
            <FormattedMessage id="container.action.unpause"/>
          </AsyncButton>
        </MDLWrapper>
      );
    } else {
      return null;
    }
  }

  private handleStopClick = async () => {
    await this.props.container.stop();
  };

  private handleStartClick = async () => {
    await this.props.container.start();
  };

  private handlePauseClick = async () => {
    await this.props.container.pauseContainer();
  };

  private handleUnPauseClick = async () => {
    await this.props.container.unPauseContainer();
  };

  private handleRemoveClick = async () => {
    await this.containerStore.removeContainer(this.props.container.id);
    hashHistory.replace('/containers');
  };
}
