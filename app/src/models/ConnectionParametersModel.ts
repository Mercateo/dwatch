import { observable } from 'mobx/lib/mobx';
import { provideInstance } from '../utils/IOC';

export enum CONFIG_TYPE {
  SOCKET,
  HOST
}

export enum PROTOCOL {
  HTTP,
  HTTPS
}

@provideInstance(ConnectionParametersModel)
export class ConnectionParametersModel {
  @observable
  configType: CONFIG_TYPE = CONFIG_TYPE.HOST;

  @observable
  socketPath: string;

  @observable
  host: string;

  @observable
  port: number;

  @observable
  protocol: PROTOCOL = PROTOCOL.HTTPS;

  @observable
  caFile: string;

  @observable
  certFile: string;

  @observable
  keyFile: string;
}
