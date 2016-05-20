import { observable } from 'mobx/lib/mobx';
import { provideSingleton } from '../utils/IOC';

export interface NotificationAction {
  actionHandler: () => void;
  actionText: string;
}

export enum NOTIFICATION_TYPE {
  WARNING,
  ERROR,
  SUCCESS,
  CUSTOM
}

export interface Notification {
  message: string;
  type: NOTIFICATION_TYPE;
  timeout?: number;
  action?: NotificationAction;
  processedAt?: number;
}

@provideSingleton(NotificationStore)
export class NotificationStore {
  @observable
  notifications: Array<Notification> = [];
}
