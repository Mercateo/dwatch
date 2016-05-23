import React, { Component } from 'react';
import { observer } from 'mobx-react/index';
import { observable, computed, autorun } from 'mobx/lib/mobx';
import { UiStore } from '../../stores/UiStore';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { hashHistory } from 'react-router';
import { inject } from '../../utils/IOC';
import { ImageStore } from '../../stores/ImageStore';
import { ImageModel } from '../../models/ImageModel';
import { ImageCard } from './cards/ImageCard';
import { normalizeImageId } from '../../utils/Helper';
import { DetailCard } from './cards/DetailCard';
import { HistoryCard } from './cards/HistoryCard';

interface ImageProps {
  intl: InjectedIntlProps;
  params: {
    imageId: string
  };
}

@injectIntl
@observer
export class Image extends Component<ImageProps, {}> {
  private pageTitleDisposer;

  @inject(UiStore)
  private uiStore: UiStore;

  @inject(ImageStore)
  private imageStore: ImageStore;

  @observable
  private imageId: string;

  @computed
  private get image (): ImageModel {
    return this.imageStore.images.get(this.imageId);
  }

  async componentWillMount () {
    const { imageId } = this.props.params;
    const { formatMessage } = this.props.intl;

    this.imageId = imageId;
    await this.loadImage(imageId);

    this.pageTitleDisposer = autorun(() => {
      if (this.image != null) {
        this.uiStore.pageTitle = formatMessage({ id: 'image.title' }, { name: this.image.name || normalizeImageId(this.image.id).substr(0, 12) });
      }
    });
  }

  async componentWillReceiveProps (nextProps: ImageProps) {
    if (nextProps.params.imageId !== this.props.params.imageId) {
      this.imageId = nextProps.params.imageId;
      await this.loadImage(nextProps.params.imageId);
    }
  }

  componentWillUnmount (): any {
    if (this.pageTitleDisposer != null) {
      this.pageTitleDisposer();
    }
  }

  render () {
    if (this.image != null) {
      return (
        <div>
          <div className="mdl-grid">
            <ImageCard image={this.image}/>

            <DetailCard image={this.image}/>

            <HistoryCard image={this.image}/>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  private async loadImage (imageId: string) {
    const finishTask = this.uiStore.startAsyncTask();

    try {
      await this.imageStore.loadImage(imageId);
      finishTask();
    } catch (e) {
      hashHistory.replace('/images');
      finishTask(e);
    }
  }
}
