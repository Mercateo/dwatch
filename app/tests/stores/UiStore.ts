import expect from 'expect';
import { UiStore, StopAsyncTask } from '../../src/stores/UiStore';
import { Notification, NOTIFICATION_TYPE, NotificationStore } from '../../src/stores/NotificationStore';
import { kernel } from '../../src/utils/IOC';
import { bindMock } from '../mocks/Helper';
import { Mock } from 'emock';

describe('UiStore.ts', () => {
  let store: UiStore;
  let notificationStoreMock: Mock<NotificationStore>;

  beforeEach(() => {
    kernel.snapshot();
    
    notificationStoreMock = Mock.of(NotificationStore);
    bindMock(NotificationStore, notificationStoreMock.mock);

    notificationStoreMock.mock.notifications = [];
    
    store = kernel.get(UiStore);
  });

  it('should let me start and stop async tasks (without errors)', () => {
    let task: StopAsyncTask = store.startAsyncTask();
    expect(store.isLoading).toBeTruthy();

    task();
    expect(store.isLoading).toBeFalsy();
  });

  it('should let me start and stop async tasks (with errors)', () => {
    let task: StopAsyncTask = store.startAsyncTask();
    expect(store.isLoading).toBeTruthy();

    task(new Error('test'));
    expect(store.isLoading).toBeFalsy();

    expect(notificationStoreMock.mock.notifications.length).toBe(1);

    let notification: Notification = notificationStoreMock.mock.notifications[ 0 ];
    expect(notification.message).toBe('test');
    expect(notification.type).toBe(NOTIFICATION_TYPE.ERROR);
  });

  afterEach(() => {
    kernel.restore();
  });
});
