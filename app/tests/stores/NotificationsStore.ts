import expect from 'expect';
import { NotificationStore } from '../../src/stores/NotificationStore';
import { kernel } from '../../src/utils/IOC';

describe('NotificationStore.ts', () => {
  let store;

  beforeEach(() => {
    kernel.snapshot();
    store = kernel.get(NotificationStore);
  });

  it('should initialize an empty notifications queue', () => {
    expect(store.notifications.length).toBe(0);
  });

  afterEach(() => {
    kernel.restore();
  });
});
