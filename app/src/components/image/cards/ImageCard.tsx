import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { FormattedMessage, FormattedRelative, FormattedNumber, injectIntl, InjectedIntlProps } from 'react-intl';
import { observer } from 'mobx-react/index';
import { ImageModel } from '../../../models/ImageModel';
import { normalizeImageId, parseBytes } from '../../../utils/Helper';
import { inject } from '../../../utils/IOC';
import { ImageStore } from '../../../stores/ImageStore';
import { MDLWrapper } from '../../shared/MDLWrapper';
import { AsyncButton } from '../../shared/AsyncButton';
import { NotificationStore, NOTIFICATION_TYPE, Notification } from '../../../stores/NotificationStore';
import { CardRow } from '../../shared/CardRow';

const styles = require('./../../shared/Common.css');

interface ImageCardProps {
  image: ImageModel;
  intl?: InjectedIntlProps;
}

@injectIntl
@observer
export class ImageCard extends Component<ImageCardProps, {}> {
  @inject(ImageStore)
  private imageStore: ImageStore;

  @inject(NotificationStore)
  private notificationStore: NotificationStore;

  render () {
    const { image } = this.props;
    let size = parseBytes(image.size);

    return (
      <div
        className="mdl-cell mdl-cell--6-col mdl-cell--4-col-tablet mdl-cell--8-col-phone mdl-card mdl-shadow--4dp">
        <div className="mdl-card__title mdl-card--border">
          <h2 className="mdl-card__title-text">
            <FormattedMessage id="image.header"/>
          </h2>
        </div>
        <div className="mdl-card__supporting-text">
          <CardRow label={<FormattedMessage id="images.th.id"/>}
                   content={<strong>{normalizeImageId(image.id).substr(0, 12) }</strong>}/>

          <CardRow label={<FormattedMessage id="images.th.name"/>}
                   content={<strong>{image.name}</strong>}/>

          <CardRow label={<FormattedMessage id="images.th.tags"/>}
                   content={<strong>{image.tags ? image.tags.join(', ') : null}</strong>}/>

          <CardRow label={<FormattedMessage id="images.th.created"/>}
                   content={<strong><FormattedRelative value={image.created.getTime() }/></strong>}/>

          <CardRow label={<FormattedMessage id="images.th.size"/>}
                   content={<strong><FormattedNumber value={size.size}/>{ ' ' + size.unit }</strong>}/>

          <CardRow label={<FormattedMessage id="image.detail.author"/>}
                   content={<strong>{image.author}</strong>}/>

          <CardRow label={<FormattedMessage id="image.detail.os"/>}
                   content={<strong>{image.os}</strong>}/>

          <CardRow label={<FormattedMessage id="image.detail.arch"/>}
                   content={<strong>{image.arch}</strong>}/>
        </div>
        <div className="mdl-layout-spacer"></div>
        <div className={`mdl-card__actions ${styles.flexActionBar} mdl-card--border`}>
          {this.renderRemoveButton()}
        </div>
      </div>
    );
  }

  private renderRemoveButton () {
    return (
      <MDLWrapper>
        <AsyncButton
          className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
          onClick={this.handleRemoveClick}>
          <FormattedMessage id="image.action.remove"/>
        </AsyncButton>
      </MDLWrapper>
    );
  }

  private handleRemoveClick = async () => {
    try {
      await this.imageStore.removeImage(this.props.image.id);
      hashHistory.replace('/images');
    } catch (e) {
      if (e.message.includes('HTTP') && e.message.includes('409')) {
        const notification: Notification = {
          type: NOTIFICATION_TYPE.WARNING,
          message: this.props.intl.formatMessage({ id: 'image.action.remove.warning' }),
          timeout: 5000
        };

        this.notificationStore.notifications.push(notification);
      } else {
        throw e;
      }
    }
  };
}
