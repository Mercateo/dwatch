import React, { Component } from 'react';
import { FormattedMessage, FormattedRelative, FormattedNumber } from 'react-intl';
import { observer } from 'mobx-react/index';
import { ImageModel } from '../../../models/ImageModel';
import { normalizeImageId, parseBytes } from '../../../utils/Helper';

const styles = require('./../../shared/Common.css');

@observer
export class ImageCard extends Component<{image: ImageModel}, {}> {
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
            <li><FormattedMessage id="images.th.author"/></li>
            <li>
              <strong>{image.author}</strong>
            </li>
          </ul>

          <ul className={`${styles.inlineList}`}>
            <li><FormattedMessage id="images.th.os"/></li>
            <li>
              <strong>{image.os}</strong>
            </li>
          </ul>

          <ul className={`${styles.inlineList}`}>
            <li><FormattedMessage id="images.th.arch"/></li>
            <li>
              <strong>{image.arch}</strong>
            </li>
          </ul>

        </div>
        {/*
        <div className={`mdl-card__actions ${styles.flexActionBar} mdl-card--border`}>

        </div>*/}
      </div>
    );
  }
}
