import expect, { createSpy } from 'expect';
import { SettingsStore } from '../../src/stores/SettingsStore';
import { bindMock } from '../mocks/Helper';
import { kernel, Fetch } from '../../src/utils/IOC';
import { ReleaseStore } from '../../src/stores/ReleaseStore';
import { UiStore } from '../../src/stores/UiStore';
import { Mock } from 'emock/dist/emock';

declare var __VERSION__: any;

describe('ReleaseStore.ts', () => {
  let store: ReleaseStore;
  let uiStoreMock: Mock<UiStore>;
  let settingsStoreMock: Mock<SettingsStore>;
  let newVersion = 'v10.0.0';
  let fetchMock;

  beforeEach(() => {
    kernel.snapshot();

    fetchMock = createSpy().andReturn(new Promise((resolve) => resolve({
      json: createSpy().andReturn(new Promise((resolve) => resolve([
        {
          id: 5,
          name: __VERSION__
        },
        {
          id: 6,
          name: newVersion
        }
      ])))
    })));

    uiStoreMock = Mock.of(UiStore);
    settingsStoreMock = Mock.of(SettingsStore);

    uiStoreMock.spyOn(x => x.startAsyncTask()).andReturn(() => {});

    bindMock(UiStore, uiStoreMock.mock);
    bindMock(SettingsStore, settingsStoreMock.mock);
    bindMock(Fetch, fetchMock);

    store = kernel.get(ReleaseStore);
  });

  it('should let me check for a new release', async () => {
    settingsStoreMock.mock.showUpdateNotifications = true;

    expect(fetchMock).toNotHaveBeenCalled();
    expect(store.newVersion).toEqual(null);

    await store.checkForUpdate();

    expect(fetchMock).toHaveBeenCalled();
    expect(store.newVersion).toBe(newVersion);
  });

  it('should fail silently', async () => {
    settingsStoreMock.mock.showUpdateNotifications = true;
    fetchMock.andReturn(new Promise((resolve, reject) => reject('e')));

    expect(fetchMock).toNotHaveBeenCalled();
    expect(store.newVersion).toEqual(null);

    await store.checkForUpdate();

    expect(fetchMock).toHaveBeenCalled();
    expect(store.newVersion).toEqual(null);
  });

  it('should call nothing if update notifications are disabled', async () => {
    settingsStoreMock.mock.showUpdateNotifications = false;

    expect(fetchMock).toNotHaveBeenCalled();
    expect(store.newVersion).toEqual(null);

    await store.checkForUpdate();

    expect(fetchMock).toNotHaveBeenCalled();
    expect(store.newVersion).toEqual(null);
  });

  afterEach(() => {
    kernel.restore();
  });
});
