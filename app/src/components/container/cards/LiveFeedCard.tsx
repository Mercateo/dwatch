import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Top } from '../../shared/Top';
import { MDLWrapper } from '../../shared/MDLWrapper';
import { ContainerModel } from '../../../models/ContainerModel';

export class LiveFeedCard extends Component<{container: ContainerModel}, {}> {
  render () {
    const { container } = this.props;
    return (
      <div className="mdl-cell mdl-cell--12-col mdl-card mdl-shadow--4dp">
        <div className="mdl-card__title mdl-card--border">
          <h2 className="mdl-card__title-text">
            <FormattedMessage id="container.live.title"/>
          </h2>
        </div>
        <MDLWrapper>
          <div className="mdl-tabs mdl-js-tabs">
            <div className="mdl-tabs__tab-bar">
              {/*<a href="#terminal" className="mdl-tabs__tab">Terminal</a>*/}
              <a href="#top" className="mdl-tabs__tab is-active">
                <FormattedMessage id="container.live.top"/>
              </a>
              {/*<a href="#fs" className="mdl-tabs__tab">File system changes</a>*/}
            </div>
            <div className="mdl-tabs__panel" id="terminal">
              <p>content</p>
            </div>
            <div className="mdl-tabs__panel is-active" id="top">
              <Top container={container}/>
            </div>
            <div className="mdl-tabs__panel" id="fs">
              <p>content</p>
            </div>
          </div>
        </MDLWrapper>
      </div>
    );
  }
}
