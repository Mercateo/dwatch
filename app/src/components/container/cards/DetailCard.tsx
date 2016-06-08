import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { ContainerModel } from '../../../models/ContainerModel';
import { TwoColumnCardRow } from '../../shared/TwoColumnCardRow';

const styles = require('./../../shared/Common.css');

export class DetailCard extends Component<{container: ContainerModel}, {}> {
  render () {
    const { container } = this.props;
    return (
      <div
        className="mdl-cell mdl-cell--6-col mdl-cell--4-col-tablet mdl-cell--8-col-phone mdl-card mdl-shadow--4dp">
        <div className="mdl-card__title mdl-card--border">
          <h2 className="mdl-card__title-text">
            <FormattedMessage id="container.detail.header"/>
          </h2>
        </div>
        <div className="mdl-card__supporting-text">
          <TwoColumnCardRow left={<FormattedMessage id="container.detail.commands"/>}
                            right={<strong>{container.cmd.join(' ')}</strong>}/>

          <TwoColumnCardRow left={<FormattedMessage id="container.detail.environment"/>}
                            right={
                <ul className={styles.unstyledList}>
                  { container.environment.map((environment, index) => (
                    <li key={index}>
                      <strong>{environment}</strong>
                    </li>
                  )) }
                </ul>
              }/>


          <TwoColumnCardRow left={<FormattedMessage id="container.detail.pwd"/>}
                            right={<strong>{container.workingDir}</strong>}/>
        </div>
      </div>
    );
  }
}
