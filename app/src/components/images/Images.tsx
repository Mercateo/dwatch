import React, { Component } from 'react';
import { observer } from 'mobx-react/index';
import { FormattedMessage, FormattedRelative, FormattedNumber, InjectedIntlProps, injectIntl } from 'react-intl';
import { UiStore } from '../../stores/UiStore';
import { observable, computed } from 'mobx/lib/mobx';
import { Link } from 'react-router';
import { inject } from '../../utils/IOC';
import { ImageStore } from '../../stores/ImageStore';
import { ImageModel } from '../../models/ImageModel';
import { parseBytes, normalizeImageId } from '../../utils/Helper';
import { AsyncButton } from '../shared/AsyncButton';
import { Notification, NOTIFICATION_TYPE, NotificationStore } from '../../stores/NotificationStore';
import { MDLWrapper } from '../shared/MDLWrapper';

const styles = require('./../shared/Common.css');

interface ImagesProps {
  intl: InjectedIntlProps;
  location: {
    query: {
      showDangling?: string
    }
  }
}

@injectIntl
@observer
export class Images extends Component<ImagesProps, {}> {
  @inject(NotificationStore)
  private notificationStore: NotificationStore;

  @inject(UiStore)
  private uiStore: UiStore;

  @inject(ImageStore)
  private imageStore: ImageStore;

  @observable
  private showDanglingImages: boolean = false;

  @computed
  private get images () {
    return this.imageStore.images.values().filter(image => !image.dangling);
  }

  @computed
  private get danglingImages () {
    return this.imageStore.images.values().filter(image => image.dangling);
  }

  async componentWillMount () {
    const { formatMessage } = this.props.intl;
    this.uiStore.pageTitle = formatMessage({ id: 'images.title' });

    this.setFilter(this.props);

    await this.loadImages();
  }

  render () {
    let images = this.images;

    if (this.showDanglingImages) {
      images = this.danglingImages;
    }

    return (
      <div>
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--12-col mdl-card mdl-shadow--4dp" style={{ minHeight: '0px' }}>
            <div className="mdl-card__supporting-text">
              <ul className={`${styles.inlineList}`}>
                <li>
                  <label>
                    <input type="checkbox"
                           checked={this.showDanglingImages}
                           onChange={this.changeFilter}/>
                    <FormattedMessage id='images.filter.showDangling'/>
                  </label>
                </li>
                {this.renderGCButton()}
              </ul>
            </div>
          </div>
        </div>
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--12-col">
            <table
              className={`mdl-data-table mdl-js-data-table mdl-shadow--2dp ${styles.fullWidthTable} ${styles.fixedLayoutTable}`}>
              <thead>
              <tr>
                <th className="mdl-data-table__cell--non-numeric">
                  <FormattedMessage
                    id='images.th.id'/>
                </th>
                <th className={`mdl-data-table__cell--non-numeric`}>
                  <FormattedMessage
                    id='images.th.name'/>
                </th>
                <th className={`mdl-data-table__cell--non-numeric`}>
                  <FormattedMessage
                    id='images.th.tags'/>
                </th>
                <th className="mdl-data-table__cell--non-numeric">
                  <FormattedMessage
                    id='images.th.created'/>
                </th>
                <th className="mdl-data-table__cell--non-numeric">
                  <FormattedMessage
                    id='images.th.size'/>
                </th>
              </tr>
              </thead>
              <tbody>
              {
                images.map((image: ImageModel) => {
                  let size = parseBytes(image.size);

                  return (
                    <tr key={image.id}>
                      <td className="mdl-data-table__cell--non-numeric">
                        <Link to={`/images/${image.id}`}>{normalizeImageId(image.id).substr(0, 12)}</Link>
                      </td>
                      <td className={`mdl-data-table__cell--non-numeric ${styles.wrap}`}>
                        <span className="mdl-typography--body-1">
                          {image.name}
                        </span>
                      </td>
                      <td className={`mdl-data-table__cell--non-numeric ${styles.wrap}`}>
                        <span className="mdl-typography--body-1">
                          {image.tags ? image.tags.join(', ') : null}
                        </span>
                      </td>
                      <td className={`mdl-data-table__cell--non-numeric ${styles.wrap}`}>
                        <FormattedRelative value={image.created.getTime() }/>
                      </td>
                      <td className={`mdl-data-table__cell--non-numeric ${styles.wrap}`}>
                        <FormattedNumber value={size.size}/>{ ' ' + size.unit }
                      </td>
                    </tr>
                  )
                })
              }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  private async loadImages () {
    const finishTask = this.uiStore.startAsyncTask();

    try {
      await this.imageStore.loadImages();
      finishTask();
    } catch (e) {
      finishTask(e);
    }
  }

  private setFilter (props: ImagesProps) {
    const { query } = props.location;

    if (query.showDangling != null) {
      this.showDanglingImages = true;
    }
  }

  private changeFilter = () => {
    this.showDanglingImages = !this.showDanglingImages;
  };

  private renderGCButton () {
    if (this.showDanglingImages) {
      return (
        <li>
          <MDLWrapper>
            <AsyncButton onClick={this.removeDanglingImages}
                         className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
              <FormattedMessage id='images.actions.gc'/>
            </AsyncButton>
          </MDLWrapper>
        </li>
      );
    } else {
      return null;
    }
  }

  private removeDanglingImages = async () => {
    const finishTask = this.uiStore.startAsyncTask();

    try {
      await Promise.all(this.danglingImages.map(image => this.imageStore.removeImage(image.id)));
    } catch(e) {
      const notification: Notification = {
        type: NOTIFICATION_TYPE.WARNING,
        message: this.props.intl.formatMessage({ id: 'images.actions.gc.warning' }),
        timeout: 5000
      };

      this.notificationStore.notifications.push(notification);
    } finally {
      finishTask();
    }
  };
}
