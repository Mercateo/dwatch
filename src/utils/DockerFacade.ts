import Dockerode from 'dockerode';
import { SettingsStore } from '../stores/SettingsStore';
import { readFileSync } from 'fs';
import { autorun } from 'mobx/lib/mobx';
import { inject, provideSingleton, kernel } from './IOC';
import { NOTIFICATION_TYPE, NotificationStore } from '../stores/NotificationStore';
import { CONFIG_TYPE, PROTOCOL } from '../models/ConnectionParametersModel';

export interface DockerConfig {
  protocol?: string;
  host?: string;
  port?: number;
  socketPath?: string;
  ca?: Buffer;
  cert?: Buffer;
  key?: Buffer;
}

export interface Version {
  Version: string;
  Os: string;
  KernelVersion: string;
  GoVersion: string;
  GitCommit: string;
  Arch: string;
  ApiVersion: string;
  BuildTime: Date;
}

export interface SummarizedContainer {
  Command: string;
  Created: number;
  HostConfig: Object;
  Id: string;
  Image: string;
  ImageID: string;
  Labels: Object;
  Names: Array<string>;
  NetworkSettings: Object;
  Ports: Array<any>;
  Status: string;
}

export interface TopModel {
  Processes: Array<Array<string>>;
  Titles: Array<string>;
}

export interface DockerEvent {
  Action: 'create' | 'attach' | 'connect' | 'start' | 'resize' | 'kill' | 'die' | 'disconnect' | 'destroy' | 'top' | 'pause' | 'unpause';
  Type: 'container' | 'network';
  from: string
  id: string;
  status: string;
  time: number;
}

export interface DockerSwarmEvent  {
  status: 'create' | 'attach' | 'connect' | 'start' | 'resize' | 'kill' | 'die' | 'disconnect' | 'destroy' | 'top' | 'pause' | 'unpause';
  id: string;
  from: string;
  time: number;
  node: {
    Addr: string;
    Id: string;
    Ip: string;
    Name: string;

  };
}

export class Container {
  Id: string;
  Name: string;
  Created: string;
  State: {
    Error: string,
    ExitCode: number,
    FinishedAt: string,
    OOMKilled: boolean,
    Dead: boolean,
    Paused: boolean,
    Pid: number,
    Restarting: boolean,
    Running: boolean,
    StartedAt: string,
    Status: string
  };

  Config: {
    AttachStderr: boolean;
    AttachStdin: boolean;
    AttachStdout: boolean;
    Cmd: Array<string>;
    Domainname: string;
    Entrypoint: string,
    Env: Array<string>;
    ExposedPorts: Object;
    Hostname: string;
    Image: string;
    Labels: Object;
    MacAddress: string;
    NetworkDisabled: boolean;
    OnBuild: string;
    OpenStdin: boolean;
    StdinOnce: boolean;
    Tty: boolean;
    User: string;
    Volumes: Object;
    WorkingDir: string;
    StopSignal: string;
  };

  NetworkSettings: {
    Bridge: string;
    SandboxID: string;
    HairpinMode: boolean;
    LinkLocalIPv6Address: string;
    LinkLocalIPv6PrefixLen: number;
    Ports: any;
    SandboxKey: string;
    SecondaryIPAddresses: string;
    SecondaryIPv6Addresses: string;
    EndpointID: string;
    Gateway: string;
    GlobalIPv6Address: string;
    GlobalIPv6PrefixLen: number;
    IPAddress: string;
    IPPrefixLen: number;
    IPv6Gateway: string;
    MacAddress: string;
    Networks: any;
  };

  Node: {
    Addr: string;
    Cpus: number;
    ID: string;
    IP: string;
    Memory: number;
    Name: string;
  };

  constructor (data: any, private container: any) {
    Object.assign(this, data);
  }

  top (): Promise<TopModel> {
    return new Promise<TopModel>((resolve, reject) => {
      this.container.top((err: any, data: TopModel) => {
        if (err) {
          return reject(err);
        }

        resolve(data);
      });
    });
  }

  stats (): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.container.stats((err: any, stream: any) => {
        if (err) {
          return reject(err);
        }

        resolve(stream);
      });
    });
  }

  unpause (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.container.unpause((err: any) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  pause (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.container.pause((err: any) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  start (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.container.start((err: any) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  stop (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.container.stop((err: any) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }
}

@provideSingleton(DockerFacade)
export class DockerFacade {
  private dockerode: Dockerode;
  private eventListeners: Array<(event: DockerEvent | DockerSwarmEvent) => void> = [];
  private eventStream: any;

  @inject(SettingsStore)
  private settingsStore: SettingsStore;

  @inject(NotificationStore)
  private notificationStore: NotificationStore;

  constructor () {
    let dockerConfig: DockerConfig = null;

    autorun(() => {
      switch (this.settingsStore.connectionSettings.configType) {
        case CONFIG_TYPE.SOCKET:
          dockerConfig = {
            socketPath: this.settingsStore.connectionSettings.socketPath
          };
          break;
        case CONFIG_TYPE.HOST:
          try {
            dockerConfig = {
              host: this.settingsStore.connectionSettings.host,
              port: this.settingsStore.connectionSettings.port,
              protocol: this.settingsStore.connectionSettings.protocol === PROTOCOL.HTTP ? 'http' : 'https',
              ca: this.settingsStore.connectionSettings.caFile ? readFileSync(this.settingsStore.connectionSettings.caFile) : null,
              cert: this.settingsStore.connectionSettings.certFile ? readFileSync(this.settingsStore.connectionSettings.certFile) : null,
              key: this.settingsStore.connectionSettings.keyFile ? readFileSync(this.settingsStore.connectionSettings.keyFile) : null
            };
          } catch (e) {
          }
          break;
        default:
          throw new Error('no suitable config type');
      }

      this.dockerode = new (kernel.get(Dockerode))(dockerConfig);

      if(this.eventStream != null) {
        this.eventStream.destroy();
      }

      this.listenForEvents((error, event)  => {
        if (error != null) {
          this.notificationStore.notifications.push({
            type: NOTIFICATION_TYPE.ERROR,
            message: error.message || 'Error while processing docker events',
          });

          return;
        }

        this.eventListeners.forEach(cb => cb(event));
      });
    });
  }

  onEvent(cb: (event: DockerEvent | DockerSwarmEvent) => void): void {
    this.eventListeners.push(cb);
  }

  getContainer (containerId: string): Promise<Container> {
    return new Promise<Container>((resolve, reject) => {
      const container = this.dockerode.getContainer(containerId);

      container.inspect({}, (err: Error, data: any) => {
        if (err) {
          return reject(err);
        }

        resolve(new Container(data, container));
      });
    });
  }

  version(): Promise<Version> {
    return new Promise<Version>((resolve, reject) => {
      this.dockerode.version((err, data) => {
        if(err) {
          return reject(err);
        }

        resolve(data);
      })
    });
  }

  listAllContainers (): Promise<Array<Container>> {
    return this.listContainers({
      all: true
    });
  }

  removeContainer (containerId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.dockerode.getContainer(containerId).remove({}, (err: any) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  // info(): Promise<any> {
  //   return new Promise<any>((resolve, reject) => {
  //     this.dockerode.info((err, data) => {
  //       if(err) {
  //         return reject(err);
  //       }
  //
  //       resolve(data);
  //     })
  //   });
  // }x

  // getNetworks(query: Object = {} = {}): Promise<Array<Object>> {
  //   return new Promise((resolve, reject) => {
  //     this.dockerode.listNetworks(query, (err, networks) => {
  //       if (err) {
  //         return reject();
  //       }
  //
  //       resolve(networks);
  //     });
  //   });
  // }

  private async listContainers (options: Object = {}): Promise<Array<Container>> {
    return await Promise.all(
      (await new Promise<Array<SummarizedContainer>>((resolve, reject) => {
        this.dockerode.listContainers(options, (err: any, containers: Array<SummarizedContainer>) => {
          if (err) {
            return reject(err);
          }

          resolve(containers);
        })
      }))
        .map((container: SummarizedContainer) => this.getContainer(container.Id)));
  }

  private listenForEvents (cb: (err: any, event?: DockerEvent | DockerSwarmEvent) => void): void {
    const options = {
      path: '/events',
      method: 'GET',
      isStream: true,
      statusCodes: {
        200: true,
        500: 'server error'
      }
    };

    this.dockerode.modem.dial(options, (err, stream) => {
      if (err) {
        return cb(err);
      }

      this.eventStream = stream;

      this.dockerode.modem.followProgress(stream,
        cb,
        event => cb(null, event));
    });
  }
}
