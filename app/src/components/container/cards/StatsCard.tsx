import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Stats } from '../Stats';
import { ContainerModel } from '../../../models/ContainerModel';

export class StatsCard extends Component<{container: ContainerModel}, {}> {
  render () {
    return (
      <div
        className="mdl-cell mdl-cell--6-col mdl-cell--4-col-tablet mdl-cell--8-col-phone mdl-card mdl-shadow--4dp">
        <div className="mdl-card__title mdl-card--border">
          <h2 className="mdl-card__title-text">
            <FormattedMessage id="container.stats.header"/>
          </h2>
        </div>
        <div className="mdl-card__supporting-text">
          <Stats container={this.props.container}/>
        </div>
      </div>
    );
  }
}
