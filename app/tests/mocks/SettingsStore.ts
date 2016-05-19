import { LOCALE } from '../../src/stores/SettingsStore';
import { CONFIG_TYPE, PROTOCOL } from '../../src/models/ConnectionParametersModel';

export function getSettingsMock(): any {
  return {
    locale: LOCALE.DE_DE,
    connectionSettings: {
      configType: CONFIG_TYPE.SOCKET,
      host: 'foo',
      port: 3000,
      protocol: PROTOCOL.HTTP,
      caFile: '/path',
      certFile: '/path2',
      keyFile: '/path3',
      socketPath: '/path4'
    }
  };
}
