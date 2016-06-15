import React, { Component } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { ContainerModel } from '../../../models/ContainerModel';
import { parseBytes } from '../../../utils/Helper';
import { TwoColumnCardRow } from '../../shared/TwoColumnCardRow';

export class NodeCard extends Component<{container: ContainerModel}, {}> {
  render () {
    const { node } = this.props.container;

    if (node == null) {
      return null;
    }

    const memoryLimit = parseBytes(node.memoryLimit);

    return (
      <div
        className="mdl-cell mdl-cell--6-col mdl-cell--4-col-tablet mdl-cell--8-col-phone mdl-card mdl-shadow--4dp">
        <div className="mdl-card__title mdl-card--border">
          <h2 className="mdl-card__title-text">
            <FormattedMessage id="container.node.header"/>
          </h2>
        </div>
        <div className="mdl-card__supporting-text">
          <TwoColumnCardRow left={<FormattedMessage id="container.node.name"/>}
                            right={<strong>{node.name}</strong>}/>

          <TwoColumnCardRow left={<FormattedMessage id="container.node.cpuCount"/>}
                            right={<strong>{node.cpuCount}</strong>}/>

          <TwoColumnCardRow left={<FormattedMessage id="container.node.memoryLimit"/>}
                            right={<strong><FormattedNumber value={memoryLimit.size}/>{ ' ' + memoryLimit.unit }</strong>}/>

          <TwoColumnCardRow left={<FormattedMessage id="container.node.ip"/>}
                            right={<strong>{node.ip}</strong>}/>
        </div>
      </div>
    );
  }
}
