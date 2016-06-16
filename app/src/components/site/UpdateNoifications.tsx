import React, { Component } from 'react';
import { observer } from 'mobx-react/index';
import { shell } from 'electron';
import { inject } from '../../utils/IOC';
import { ReleaseStore } from '../../stores/ReleaseStore';
import { MDLWrapper } from '../shared/MDLWrapper';

@observer
export class UpdateNotifications extends Component<void, {}> {
  @inject(ReleaseStore)
  private releaseStore: ReleaseStore;

  render () {
    if (this.releaseStore.newVersion == null) {
      return null;
    }

    return (
      <span>
        <span id="update-overlay"
              className="icon material-icons"
              onClick={this.openReleasesPage}>announcement</span>
          <MDLWrapper>
            <div className="mdl-tooltip" htmlFor="update-overlay">
               An update is available for DWatch!
               <br/>
               Your version: v{this.releaseStore.currentVersion} New Version: v{this.releaseStore.newVersion}
              <br/>
               Please have a look at the DWatch release page.
             </div>
          </MDLWrapper>
        </span>
    );
  }

  private openReleasesPage = () => {
    shell.openExternal('https://github.com/Mercateo/dwatch/releases');
  }
}
