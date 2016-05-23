import { createSpy } from 'expect';
import { TopModel, Version } from '../../src/utils/DockerFacade';
import { HistoryEntry } from '../../src/models/ImageModel';

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

export function getImageResponseMock(): any {
  return {
    Architecture: 'amd64',
    Author: 'Brian Palmer <brian@codekitchen.net>',
    Config: {
      Cmd: [ 'bin', '-sh' ],
      Entrypoint: [ 'test1.sh', 'test2.sh' ],
      Env: [ 'TEST_VAR=5'],
      ExposedPorts: {
        '9000/tcp': null,
        '8080/udp': null,
      },
      User: 'TestUser',
      Volumes: {
        '/temp/tmp': null
      },
      WorkingDir: '/app'
    },
    Created: '2016-05-20T16:14:30.654638605Z',
    Id: 'sha256:9cfad7bf4e016fb7191140fb23537636bc186ffebff82e4f9b0a04422fcf1532',
    Os: 'linux',
    RepoTags: [
      'test:0.15',
      'test:latest',
    ],
    Size: 267464419,
    VirtualSize: 267464419,

    history: createSpy()
  };
}

export function getDockerTopMock (): TopModel {
  return {
    Processes: [ [ 'top' ] ],
    Titles: [ 'name' ]
  };
}

export function getImageHistoryMock (): HistoryEntry {
  return {
    Comment: 'test',
    Created: new Date().getTime(),
    CreatedBy: 'user',
    Id: 'myId',
    Size: 100000,
    Tags: [ 'tag' ]
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
