import { createSpy } from 'expect';
import { TopModel, Version } from '../../src/utils/DockerFacade';

export function getContainerResponseMock (): any {
  return {
    Id: 'myId',
    Name: '/myContainer',
    Created: new Date(),
    Config: {
      WorkingDir: 'there',
      Image: 'myImage',
      Env: [ 'myEnv' ],
      Cmd: [ 'go-for-it' ]
    },
    State: {
      Running: true,
      FinishedAt: new Date(),
      StartedAt: new Date(),
      ExitCode: 0,
      Status: 'running'
    },
    NetworkSettings: {
      Ports: {
        '3000/tcp': null,
        '8000/udp': [
          {
            HostPort: '8080',
            HostIp: '1.3.3.7'
          }
        ]
      }
    },
    Node: {
      Addr: 'myAddr',
      Cpus: 5,
      id: 'nodeId',
      memoryLimit: 200,
      name: 'nodeName'
    },

    stop: createSpy(),
    start: createSpy(),
    pause: createSpy(),
    unpause: createSpy(),
    stats: createSpy(),
    top: createSpy()
  }
}

export function getDockerTopMock (): TopModel {
  return {
    Processes: [ [ 'top' ] ],
    Titles: [ 'name' ]
  };
}

export function getVersionResponseMock (): Version {
  return {
    Version: 'version',
    Os: 'fakeOs',
    KernelVersion: '5',
    GoVersion: '10',
    GitCommit: '13',
    Arch: 'x83',
    ApiVersion: '1000',
    BuildTime: new Date()
  };
}
