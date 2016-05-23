import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { FormattedMessage, FormattedRelative, FormattedNumber, injectIntl, InjectedIntlProps } from 'react-intl';
import { observer } from 'mobx-react/index';
import { ImageModel } from '../../../models/ImageModel';
import { normalizeImageId, parseBytes } from '../../../utils/Helper';
import { UiStore } from '../../../stores/UiStore';
import { inject } from '../../../utils/IOC';
import { ImageStore } from '../../../stores/ImageStore';
import { MDLWrapper } from '../../shared/MDLWrapper';
import { AsyncButton } from '../../shared/AsyncButton';
import { NotificationStore, NOTIFICATION_TYPE, Notification } from '../../../stores/NotificationStore';

const styles = require('./../../shared/Common.css');

interface ImageCardProps {
  image: ImageModel;
  intl?: InjectedIntlProps;
}

@injectIntl
@observer
export class ImageCard extends Component<ImageCardProps, {}> {
  @inject(UiStore)
  private uiStore: UiStore;

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

          <ul className={`${styles.inlineList}`}>
            <li><FormattedMessage id="images.th.id"/></li>
            <li>
              <strong>{normalizeImageId(image.id).substr(0, 12) }</strong>
            </li>
          </ul>

          <ul className={`${styles.inlineList}`}>
            <li><FormattedMessage id="images.th.name"/></li>
            <li>
              <strong>{image.name}</strong>
            </li>
          </ul>

          <ul className={`${styles.inlineList}`}>
            <li><FormattedMessage id="images.th.tags"/></li>
            <li>
              <strong>{image.tags ? image.tags.join(', ') : null}</strong>
            </li>
          </ul>

          <ul className={`${styles.inlineList}`}>
            <li><FormattedMessage id="images.th.created"/></li>
            <li>
              <strong>
                <FormattedRelative value={image.created.getTime() }/>
              </strong>
            </li>
          </ul>

          <ul className={`${styles.inlineList}`}>
            <li><FormattedMessage id="images.th.size"/></li>
            <li>
              <strong>
                <FormattedNumber value={size.size}/>{ ' ' + size.unit }
              </strong>
            </li>
          </ul>

          <ul className={`${styles.inlineList}`}>
            <li><FormattedMessage id="image.detail.author"/></li>
            <li>
              <strong>{image.author}</strong>
            </li>
          </ul>

          <ul className={`${styles.inlineList}`}>
            <li><FormattedMessage id="image.detail.os"/></li>
            <li>
              <strong>{image.os}</strong>
            </li>
          </ul>

          <ul className={`${styles.inlineList}`}>
            <li><FormattedMessage id="image.detail.arch"/></li>
            <li>
              <strong>{image.arch}</strong>
            </li>
          </ul>

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
    const finishTask = this.uiStore.startAsyncTask();

    try {
      await this.imageStore.removeImage(this.props.image.id);
      hashHistory.replace('/images');
      finishTask();
    } catch (e) {
      if(e.message.includes('HTTP') && e.message.includes('409')) {
        const notification: Notification = {
          type: NOTIFICATION_TYPE.WARNING,
          message: this.props.intl.formatMessage({ id: 'image.action.remove.warning' }),
          timeout: 5000
        };

        this.notificationStore.notifications.push(notification);

        finishTask();
      } else {
        finishTask(e);
      }
    }
  };
}
