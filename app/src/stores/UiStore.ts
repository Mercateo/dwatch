import { observable, computed } from 'mobx/lib/mobx';
import { Notification, NOTIFICATION_TYPE, NotificationStore } from './NotificationStore';
import { provideSingleton, inject } from '../utils/IOC';

export interface StopAsyncTask {
  (error?: Error): void;
}

@provideSingleton(UiStore)
export class UiStore {
  @inject(NotificationStore)
  private notificationStore: NotificationStore;

  @observable
  private pendingTasks: number = 0;

  @observable
  pageTitle: string = 'DWatch';

  @computed
  get isLoading(): boolean {
    return this.pendingTasks > 0;
  }

  startAsyncTask(): StopAsyncTask {
    this.pendingTasks++;

    return (error) => {
      this.pendingTasks--;

      if (error != null) {
        const notification: Notification = {
          type: NOTIFICATION_TYPE.ERROR,
          message: error.message,
          timeout: 5000
        };

        this.notificationStore.notifications.push(notification);
      }
    };
  }
}
