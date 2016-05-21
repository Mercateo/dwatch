import React, { Component } from 'react';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { observer } from 'mobx-react/index';
import { ImageModel } from '../../../models/ImageModel';
import { normalizeImageId } from '../../../utils/Helper';

const styles = require('./../../shared/Common.css');

@observer
export class DetailCard extends Component<{image: ImageModel}, {}> {
  render () {
    return (
      <div
        className="mdl-cell mdl-cell--6-col mdl-cell--4-col-tablet mdl-cell--8-col-phone mdl-card mdl-shadow--4dp">
        <div className="mdl-card__title mdl-card--border">
          <h2 className="mdl-card__title-text">
            <FormattedMessage id="image.details"/>
          </h2>
        </div>
        <div className="mdl-card__supporting-text">
          <ul className={`${styles.inlineList}`}>
            <li><FormattedMessage id="images.th.cmd"/></li>
            <li>
              <ul className={styles.unstyledList}>
                { this.props.image.cmd.map((cmd, index) => (
                  <li key={index}>
                    <strong>{cmd}</strong>
                  </li>
                )) }
              </ul>
            </li>
          </ul>

          <ul className={`${styles.inlineList}`}>
            <li><FormattedMessage id="images.th.cwd"/></li>
            <li>
              <strong>{this.props.image.workingDir}</strong>
            </li>
          </ul>

          <ul className={`${styles.inlineList}`}>
            <li><FormattedMessage id="images.th.environment"/></li>
            <li>
              <ul className={styles.unstyledList}>
                { this.props.image.environment.map((env, index) => (
                  <li key={index}>
                    <strong>{env}</strong>
                  </li>
                )) }
              </ul>
            </li>
          </ul>

          <ul className={`${styles.inlineList}`}>
            <li><FormattedMessage id="images.th.entrypoint"/></li>
            <li>
              <ul className={styles.unstyledList}>
                { this.props.image.entrypoints.map((entrypoint, index) => (
                  <li key={index}>
                    <strong>{entrypoint}</strong>
                  </li>
                )) }
              </ul>
            </li>
          </ul>

          <ul className={`${styles.inlineList}`}>
            <li><FormattedMessage id="images.th.exposed-ports"/></li>
            <li>
              <ul className={styles.unstyledList}>
                { this.props.image.exposedPorts.map((port, index) => (
                  <li key={index}>
                    <strong>{port.port}/{port.protocol}</strong>
                  </li>
                )) }
              </ul>
            </li>
          </ul>

          <ul className={`${styles.inlineList}`}>
            <li><FormattedMessage id="images.th.volumes"/></li>
            <li>
              <ul className={styles.unstyledList}>
                { this.props.image.volumes.map((volume, index) => (
                  <li key={index}>
                    <strong>{volume}</strong>
                  </li>
                )) }
              </ul>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
