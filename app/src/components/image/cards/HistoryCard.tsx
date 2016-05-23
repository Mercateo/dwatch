import React, { Component } from 'react';
import { FormattedMessage, FormattedNumber, FormattedRelative } from 'react-intl';
import { ImageModel, HistoryEntry } from '../../../models/ImageModel';
import { MDLWrapper } from '../../shared/MDLWrapper';
import { UiStore } from '../../../stores/UiStore';
import { observable } from 'mobx/lib/mobx';
import { inject } from '../../../utils/IOC';
import { normalizeImageId, parseBytes } from '../../../utils/Helper';
import { observer } from 'mobx-react/index';

const styles = require('./../../shared/Common.css');

interface HistoryCardProps {
  image: ImageModel;
}

@observer
export class HistoryCard extends Component<HistoryCardProps, {}> {
  @inject(UiStore)
  private uiStore: UiStore;

  @observable
  private history: Array<HistoryEntry> = [];

  async componentWillMount (): Promise<void> {
    await this.loadHistory(this.props);
  }

  async componentWillReceiveProps (nextProps: HistoryCardProps): Promise<void> {
    await this.loadHistory(nextProps);
  }

  render () {
    return (
      <div className="mdl-cell mdl-cell--12-col mdl-card mdl-shadow--4dp">
        <div className="mdl-card__title mdl-card--border">
          <h2 className="mdl-card__title-text">
            <FormattedMessage id="image.history.title"/>
          </h2>
        </div>
        <MDLWrapper>
          <table
            className={`mdl-data-table mdl-js-data-table mdl-shadow--2dp ${styles.fullWidthTable} ${styles.fixedLayoutTable}`}>
            <thead>
            <tr>
              <th className="mdl-data-table__cell--non-numeric">
                <FormattedMessage
                  id='image.history.created-by'/>
              </th>
              <th className="mdl-data-table__cell--non-numeric">
                <FormattedMessage
                  id='images.th.id'/>
              </th>
              <th className="mdl-data-table__cell--non-numeric">
                <FormattedMessage
                  id='images.th.tags'/>
              </th>
              <th className="mdl-data-table__cell--non-numeric">
                <FormattedMessage
                  id='images.th.size'/>
              </th>
              <th className="mdl-data-table__cell--non-numeric">
                <FormattedMessage
                  id='images.th.created'/>
              </th>
            </tr>
            </thead>
            <tbody>
            {
              this.history.map((entry: HistoryEntry, index) => {
                let size = parseBytes(entry.Size);

                return (
                  <tr key={index}>
                    <td className={`mdl-data-table__cell--non-numeric ${styles.wrap}`}>
                      {entry.CreatedBy}
                    </td>
                    <td className={`mdl-data-table__cell--non-numeric ${styles.wrap}`}>
                      {normalizeImageId(entry.Id).substr(0, 12)}
                    </td>
                    <td className={`mdl-data-table__cell--non-numeric ${styles.wrap}`}>
                      {entry.Tags ? entry.Tags.join(', ') : null}
                    </td>
                    <td className={`mdl-data-table__cell--non-numeric ${styles.wrap}`}>
                      <FormattedNumber value={size.size}/>{ ' ' + size.unit }
                    </td>
                    <td className={`mdl-data-table__cell--non-numeric ${styles.wrap}`}>
                      <FormattedRelative value={entry.Created*1000}/>
                    </td>
                  </tr>
                );
              })
            }
            </tbody>
          </table>
        </MDLWrapper>
      </div>
    );
  }

  private async loadHistory (props: HistoryCardProps): Promise<void> {
    let finishTask = this.uiStore.startAsyncTask();

    try {
      if (props.image != null) {
        let history = await props.image.getHistory();
        this.history.splice(0, this.history.length - 1);
        this.history.push(...history);
      }

      finishTask();
    } catch (e) {
      finishTask(e);
    }
  }
}
