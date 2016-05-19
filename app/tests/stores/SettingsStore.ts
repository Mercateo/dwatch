import expect from 'expect';
import { SettingsStore } from '../../src/stores/SettingsStore';
import { deepEqual } from '../mocks/Helper';
import { getSettingsMock } from '../mocks/SettingsStore';
import { kernel } from '../../src/utils/IOC';

function getPersistedStore () {
  return JSON.parse(localStorage.getItem('config'));
}

describe('SettingsStore.ts', () => {
  let settingsMock;
  let store;

  beforeEach(() => {
    kernel.snapshot();
    settingsMock = getSettingsMock();

    kernel.unbind(SettingsStore);
    kernel.bind(SettingsStore).to(SettingsStore).inSingletonScope();
    store = kernel.get(SettingsStore);
  });

  it('should initialize settings with defaults', () => {
    let persistence: SettingsStore = getPersistedStore();
    expect(persistence.locale).toBe(store.locale);
    deepEqual(persistence.connectionSettings, store.connectionSettings);
  });

  it('should persist changes to persistence', () => {
    let persistence: SettingsStore = getPersistedStore();
    expect(persistence.locale).toBe(store.locale);
    deepEqual(persistence.connectionSettings, store.connectionSettings);

    store.locale = settingsMock.locale;
    Object.assign(store, settingsMock.connectionSettings);

    persistence = getPersistedStore();
    expect(persistence.locale).toBe(store.locale);
    deepEqual(persistence.connectionSettings, store.connectionSettings);
  });

  it('should recover settings from persistence if present', () => {
    localStorage.setItem('config', JSON.stringify(settingsMock));

    kernel.unbind(SettingsStore);
    kernel.bind(SettingsStore).to(SettingsStore).inSingletonScope();
    store = kernel.get(SettingsStore);

    expect(settingsMock.locale).toBe(store.locale);
    deepEqual(settingsMock.connectionSettings, store.connectionSettings);
  });

  afterEach(() => {
    localStorage.removeItem('config');
    kernel.restore();
  });
});
