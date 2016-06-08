import { observable, autorun, transaction } from 'mobx/lib/mobx';
import { provideSingleton, inject } from '../utils/IOC';
import { ConnectionParametersModel } from '../models/ConnectionParametersModel';

export enum LOCALE {
  DE_DE,
  EN_US
}

@provideSingleton(SettingsStore)
export class SettingsStore {
  @inject(ConnectionParametersModel)
  connectionSettings: ConnectionParametersModel;

  @observable
  locale: LOCALE = LOCALE.EN_US;

  @observable
  showUpdateNotifications: boolean = true;

  constructor () {
    try {
      const config: SettingsStore = JSON.parse(localStorage.getItem('config'));

      if (config != null) {
        transaction(() => {
          this.locale = config.locale;
          this.showUpdateNotifications = config.showUpdateNotifications;

          Object.assign(this.connectionSettings, config.connectionSettings);
        });
      }
    } catch (e) {
      // swallow exception
    }

    // on first run (config == null) this will persist defaults from ConnectionParametersModel
    autorun(() => {
      localStorage.setItem('config', JSON.stringify({
        locale: this.locale,
        connectionSettings: this.connectionSettings,
        showUpdateNotifications: this.showUpdateNotifications
      }));
    });
  }
}
