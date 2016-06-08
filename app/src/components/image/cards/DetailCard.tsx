import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { observer } from 'mobx-react/index';
import { ImageModel } from '../../../models/ImageModel';
import { TwoColumnCardRow } from '../../shared/CardRow';

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
          <TwoColumnCardRow besides={true}
                            left={
                              <div>
                                <TwoColumnCardRow left={<FormattedMessage id="image.detail.cmd"/>}
                                                right={<strong>{this.props.image.cmd.join(' ')}</strong>}/>

                                <TwoColumnCardRow left={<FormattedMessage id="image.detail.cwd"/>}
                                                  right={<strong>{this.props.image.workingDir}</strong>}/>

                                <TwoColumnCardRow left={<FormattedMessage id="image.detail.environment"/>}
                                                  right={
                                    <ul className={styles.unstyledList}>
                                      { this.props.image.environment.map((env, index) => (
                                        <li key={index}>
                                          <strong>{env}</strong>
                                        </li>
                                      )) }
                                    </ul>
                                }/>
                              </div>
                            }
                            right={
                              <div>
                                <TwoColumnCardRow left={<FormattedMessage id="image.detail.entrypoint"/>}
                                                  right={
                                    <ul className={styles.unstyledList}>
                                      { this.props.image.entrypoints.map((entrypoint, index) => (
                                        <li key={index}>
                                          <strong>{entrypoint}</strong>
                                        </li>
                                      )) }
                                    </ul>
                                }/>

                                <TwoColumnCardRow left={<FormattedMessage id="image.detail.exposed-ports"/>}
                                                  right={
                                    <ul className={styles.unstyledList}>
                                      { this.props.image.exposedPorts.map((port, index) => (
                                        <li key={index}>
                                          <strong>{port.port}/{port.protocol}</strong>
                                        </li>
                                      )) }
                                    </ul>
                                }/>

                                <TwoColumnCardRow left={<FormattedMessage id="image.detail.volumes"/>}
                                                  right={
                                    <ul className={styles.unstyledList}>
                                      { this.props.image.volumes.map((volume, index) => (
                                        <li key={index}>
                                          <strong>{volume}</strong>
                                        </li>
                                      )) }
                                    </ul>
                                 }/>
                              </div>
                            }/>
        </div>
      </div>
    );
  }
}
