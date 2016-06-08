import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { ContainerModel } from '../../../models/ContainerModel';
import { TwoColumnCardRow } from '../../shared/TwoColumnCardRow';

export class NetworkCard extends Component<{container: ContainerModel}, {}> {
  render () {
    const { container } = this.props;
    return (
      <div
        className="mdl-cell mdl-cell--6-col mdl-cell--4-col-tablet mdl-cell--8-col-phone mdl-card mdl-shadow--4dp">
        <div className="mdl-card__title mdl-card--border">
          <h2 className="mdl-card__title-text">
            <FormattedMessage id="container.network.header"/>
          </h2>
        </div>
        <div className="mdl-card__supporting-text">
          <TwoColumnCardRow left={<FormattedMessage id="containers.th.ports"/>}
                            right={
              <strong>
                {container.ports.map(port => {
                  let mapping = `${port[ 0 ].port}/${port[ 0 ].protocol}`;

                  if (port[ 1 ] != null) {
                    mapping += ` -> ${port[ 1 ].ip}:${port[ 1 ].port}/${port[ 0 ].protocol}`;
                  }

                  return mapping
                }).join(', ')}
              </strong>
              }/>
        </div>
      </div>
    );
  }
}
