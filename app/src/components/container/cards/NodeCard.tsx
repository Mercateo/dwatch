import React, { Component } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { ContainerModel } from '../../../models/ContainerModel';
import { parseBytes } from '../../../utils/Helper';

const styles = require('./../../shared/Common.css');

export class NodeCard extends Component<{container: ContainerModel}, {}> {
  render () {
    const { node } = this.props.container;

    if(node != null) {
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
            <ul className={`${styles.inlineList}`}>
              <li><FormattedMessage id="container.node.name"/></li>
              <li>
                <strong>
                  {node.name}
                </strong>
              </li>
            </ul>

            <ul className={`${styles.inlineList}`}>
              <li><FormattedMessage id="container.node.cpuCount"/></li>
              <li>
                <strong>
                  {node.cpuCount}
                </strong>
              </li>
            </ul>

            <ul className={`${styles.inlineList}`}>
              <li><FormattedMessage id="container.node.memoryLimit"/></li>
              <li>
                <strong><FormattedNumber value={memoryLimit.size}/>{ ' ' + memoryLimit.unit }</strong>
              </li>
            </ul>

            <ul className={`${styles.inlineList}`}>
              <li><FormattedMessage id="container.node.ip"/></li>
              <li>
                <strong>
                  {node.ip}
                </strong>
              </li>
            </ul>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}
