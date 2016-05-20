import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { CONTAINER_RUN_STATE } from '../../../models/ContainerModel';
import { computed } from 'mobx/lib/mobx';
import { ContainerStore } from '../../../stores/ContainerStore';
import { inject } from '../../../utils/IOC';
import { UiStore } from '../../../stores/UiStore';
import { observer } from 'mobx-react/index';
import { ImageStore } from '../../../stores/ImageStore';

const styles = require('./../../shared/Common.css');

@observer
export class ImagesCard extends Component<void, {}> {
  @inject(UiStore)
  private uiStore: UiStore;

  @inject(ImageStore)
  private imageStore: ImageStore;

  @computed
  private get images() {
    return this.imageStore.images.values();
  }

  @computed
  private get danglingImages() {
    return this.images.filter(image => image.dangling);
  }

  async componentWillMount() {
    const finishTask = this.uiStore.startAsyncTask();

    try {
      await this.imageStore.loadImages();
      finishTask();
    } catch (e) {
      finishTask(e);
    }
  }

  render () {
    return (
      <div className="mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--4dp" style={{ minHeight: '0px' }}>
        <div className="mdl-card__title">
          <h2 className="mdl-card__title-text">
            <FormattedMessage id="home.images"/>
          </h2>
        </div>
        <div className="mdl-card__supporting-text">
          <p><FormattedMessage id="home.images.supportingText"/></p>
        </div>
        <div className="mdl-layout-spacer"></div>
        <div className={`mdl-card__actions ${styles.flexActionBar} mdl-card--border`}>
          <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect right" href="#/images">
            <FormattedMessage id="home.images.all" values={{ count: this.images.length }}/>
          </a>
          <div className="mdl-layout-spacer"></div>
          <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href="#/images?showDangling=true">
            <FormattedMessage id="home.images.dangling" values={{ count: this.danglingImages.length }}/>
          </a>
        </div>
      </div>
    );
  }
}
