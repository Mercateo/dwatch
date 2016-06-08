import React, { Component } from 'react';
import { FormattedMessage, FormattedDate, injectIntl } from 'react-intl';
import { inject } from '../../../utils/IOC';
import { DockerSystemStore } from '../../../stores/DockerSystemStore';
import { observer } from 'mobx-react/index';
import { UiStore } from '../../../stores/UiStore';
import { TwoColumnCardRow } from '../../shared/TwoColumnCardRow';

@injectIntl
@observer
export class SystemCard extends Component<void, {}> {
  @inject(UiStore)
  private uiStore: UiStore;

  @inject(DockerSystemStore)
  private dockerSystemStore: DockerSystemStore;

  async componentWillMount () {
    const finishTask = this.uiStore.startAsyncTask();

    try {
      await this.dockerSystemStore.loadVersion();
      finishTask();
    } catch (e) {
      finishTask(e);
    }
  }

  render () {
    const { version } = this.dockerSystemStore;

    if (version == null) {
      return null;
    }

    return (
      <div className="mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--4dp"
           style={{ minHeight: '0px' }}>
        <div className="mdl-card__title">
          <h2 className="mdl-card__title-text">
            <FormattedMessage id="home.system"/>
          </h2>
        </div>
        <div className="mdl-card__supporting-text">
          <TwoColumnCardRow besides={true}
                            left={
                               <div>
                                  <TwoColumnCardRow left={<FormattedMessage id="home.system.server-version"/>}
                                                    right={<strong>{version.Version}</strong>}/>

                                  <TwoColumnCardRow left={<FormattedMessage id="home.system.os"/>}
                                                    right={<strong>{version.Os}</strong>}/>

                                  <TwoColumnCardRow left={<FormattedMessage id="home.system.kernel-version"/>}
                                                    right={<strong>{version.KernelVersion}</strong>}/>

                                  <TwoColumnCardRow left={<FormattedMessage id="home.system.go-version"/>}
                                                    right={<strong>{version.GoVersion}</strong>}/>
                               </div>
                            }
                            right={
                               <div>
                                 <TwoColumnCardRow left={<FormattedMessage id="home.system.arch"/>}
                                                   right={<strong>{version.Arch}</strong>}/>

                                 <TwoColumnCardRow left={<FormattedMessage id="home.system.api-version"/>}
                                                   right={<strong>{version.ApiVersion}</strong>}/>

                                 <TwoColumnCardRow left={<FormattedMessage id="home.system.build-time"/>}
                                                   right={<strong><FormattedDate value={version.BuildTime}/></strong>}/>
                               </div>
                            }/>
        </div>
      </div>
    );
  }
}
