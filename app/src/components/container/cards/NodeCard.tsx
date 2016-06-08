import React, { Component } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { ContainerModel } from '../../../models/ContainerModel';
import { parseBytes } from '../../../utils/Helper';
import { CardRow } from '../../shared/CardRow';

export class NodeCard extends Component<{container: ContainerModel}, {}> {
  render () {
    const { node } = this.props.container;

    if (node !== null) {
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
          <CardRow label={<FormattedMessage id="container.node.name"/>}
                   content={<strong>{node.name}</strong>}/>

          <CardRow label={<FormattedMessage id="container.node.cpuCount"/>}
                   content={<strong>{node.cpuCount}</strong>}/>

          <CardRow label={<FormattedMessage id="container.node.memoryLimit"/>}
                   content={<strong><FormattedNumber value={memoryLimit.size}/>{ ' ' + memoryLimit.unit }</strong>}/>

          <CardRow label={<FormattedMessage id="container.node.ip"/>}
                   content={<strong>{node.ip}</strong>}/>
        </div>
      </div>
    );
  }
}
