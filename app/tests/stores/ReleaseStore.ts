import expect, { createSpy } from 'expect';
import { SettingsStore } from '../../src/stores/SettingsStore';
import { bindMock } from '../mocks/Helper';
import { kernel, Fetch } from '../../src/utils/IOC';
import { ReleaseStore } from '../../src/stores/ReleaseStore';
import { UiStore } from '../../src/stores/UiStore';
import { Mock } from 'emock/dist/emock';

describe('ReleaseStore.ts', () => {
  let store: ReleaseStore;
  let uiStoreMock: Mock<UiStore>;
  let settingsStoreMock: Mock<SettingsStore>;
  let fetchMock;

  beforeEach(() => {
    kernel.snapshot();

    fetchMock = createSpy().andReturn(new Promise((resolve) => resolve({
      json: createSpy().andReturn(new Promise((resolve) => resolve([])))
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
    
    await store.checkForUpdate();
    
    expect(fetchMock).toHaveBeenCalled();
  });

  afterEach(() => {
    kernel.restore();
  });
});
