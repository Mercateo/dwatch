import { Port, normalizePort, normalizeContainerName } from '../utils/Helper';
import { Container, TopModel } from '../utils/DockerFacade';
import { ContainerStateModel } from './ContainerStateModel';

export enum CONTAINER_RUN_STATE {
  RUNNING,
  RESTARTING,
  PAUSED,
  DEAD,
  STOPPED
}

export enum CONTAINER_STATE {
  CREATED,
  EXITED,
  RUNNING
}

export interface HostPort {
  port: number;
  ip: string;
}

export class ContainerModel {
  id: string;
  image: string;
  name: string;
  ports: Array<[Port, HostPort]>;
  environment: Array<string>;
  state: ContainerStateModel;
  cmd: Array<string>;
  created: Date;
  workingDir: string;
  node: {
    address: string;
    cpuCount: number;
    id: string;
    ip: string;
    memoryLimit: number;
    name: string;
  };

  constructor (private container: Container) {
    this.id = container.Id;
    this.name = normalizeContainerName(container.Name);
    this.image = container.Config.Image;
    this.ports = Object.keys(container.NetworkSettings.Ports || {})
                       .map(port => {
                         let hostPort: HostPort = null;
                         let internalPort: Port = normalizePort(port);

                         if (container.NetworkSettings.Ports[ port ] !== null) {
                           hostPort = {
                             port: parseInt(container.NetworkSettings.Ports[ port ][ 0 ].HostPort),
                             ip: container.NetworkSettings.Ports[ port ][ 0 ].HostIp
                           };
                         }

                         return <[Port, HostPort]>[ internalPort, hostPort ];
                       });

    this.environment = container.Config.Env || [];
    this.cmd = container.Config.Cmd || [];
    this.created = new Date(container.Created);
    this.state = new ContainerStateModel(container);
    this.workingDir = container.Config.WorkingDir;

    if(container.Node != null) {
      this.node = {
        address: container.Node.Addr,
        cpuCount: container.Node.Cpus,
        id: container.Node.ID,
        ip: container.Node.IP,
        memoryLimit: container.Node.Memory,
        name: container.Node.Name
      }
    }
  }

  stop (): Promise<void> {
    return this.container.stop();
  }

  start (): Promise<void> {
    return this.container.start();
  }

  pauseContainer (): Promise<void> {
    return this.container.pause();
  }

  unPauseContainer (): Promise<void> {
    return this.container.unpause();
  }

  stats (): Promise<any> {
    return this.container.stats();
  }

  top (): Promise<TopModel> {
    return this.container.top();
  }
}
