import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { MDLWrapper } from './MDLWrapper';
import { Notification, NOTIFICATION_TYPE, NotificationStore } from '../../stores/NotificationStore';
import { observable, autorun, Lambda } from 'mobx/lib/mobx';
import { observer } from 'mobx-react/index';
import { inject } from '../../utils/IOC';

@observer
export class Notifications extends Component<void, any> {
  @inject(NotificationStore)
  private notificationStore: NotificationStore;

  private disposer: Lambda;

  private snackbar: any;

  @observable
  private currentNotification: Notification;

  componentDidMount (): void {
    var snackbarElement: any = findDOMNode(this);
    this.snackbar = snackbarElement.MaterialSnackbar;

    // consumer of notifications
    this.disposer = autorun(() => {
      // if there is something
      if (this.notificationStore.notifications.length > 0) {
        // take the first, this will trigger a recomputation of state
        // it is possible that this leads to a pseudo "infinite" cycle if notifications has many items;
        // mobx expects that cycles stabilize after several hundred iterations or it will throw an exception
        const notificationToShow = this.notificationStore.notifications[ 0 ];
        this.notificationStore.notifications.splice(0, 1);

        if(this.currentNotification != null &&
          notificationToShow.message === this.currentNotification.message &&
          (new Date().getTime() - (this.currentNotification.processedAt || 0)) < (this.currentNotification.timeout || 5000)) {
          return;
        }

        this.currentNotification = notificationToShow;
        this.currentNotification.processedAt = new Date().getTime();

        let data: any = {
          message: notificationToShow.message,
          timeout: notificationToShow.timeout
        };

        if (notificationToShow.action != null) {
          data.actionHandler = notificationToShow.action.actionHandler;
          data.actionText = notificationToShow.action.actionText;
        }

        // fire & forgot
        this.snackbar.showSnackbar(data);
      }
    });
  }

  componentWillUnmount (): void {
    this.snackbar = null;
    this.disposer();
  }

  render () {
    return (
      <MDLWrapper>
        <div className="mdl-snackbar mdl-js-snackbar" style={{ backgroundColor: this.getColor() }}>
          <div className="mdl-snackbar__text"></div>
          <button type="button" className="mdl-snackbar__action"></button>
        </div>
      </MDLWrapper>
    );
  }

  private getColor (): string {
    if (this.currentNotification != null) {
      switch (this.currentNotification.type) {
        case NOTIFICATION_TYPE.ERROR:
          return 'red';
        case NOTIFICATION_TYPE.SUCCESS:
          return 'green';
        case NOTIFICATION_TYPE.WARNING:
          return 'orange';
        default:
          return null;
      }
    }
  }
}
