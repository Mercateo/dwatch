import expect from 'expect';
import { getContainerResponseMock } from '../mocks/DockerFacade';
import { ContainerModel } from '../../src/models/ContainerModel';
import { normalizeContainerName } from '../../src/utils/Helper';

describe('ContainerModel.ts', () => {
  let containerResponseMock;
  let container: ContainerModel;

  beforeEach(() => {
    containerResponseMock = getContainerResponseMock();
    container = new ContainerModel(containerResponseMock);
  });

  it('should probably parse a valid container response into a container', () => {
    expect(container.id).toBe(containerResponseMock.Id);
    expect(container.image).toBe(containerResponseMock.Config.Image);
    expect(container.name).toBe(normalizeContainerName(containerResponseMock.Name));
    expect(container.environment).toEqual(containerResponseMock.Config.Env);
    expect(container.cmd).toEqual(containerResponseMock.Config.Cmd);
    expect(container.created).toEqual(containerResponseMock.Created);
    expect(container.workingDir).toBe(containerResponseMock.Config.WorkingDir);

    expect(container.node.address).toBe(containerResponseMock.Node.Addr);
    expect(container.node.cpuCount).toBe(containerResponseMock.Node.Cpus);
    expect(container.node.id).toBe(containerResponseMock.Node.ID);
    expect(container.node.ip).toBe(containerResponseMock.Node.IP);
    expect(container.node.memoryLimit).toBe(containerResponseMock.Node.Memory);
    expect(container.node.name).toBe(containerResponseMock.Node.Name);
  });

  it('should probably parse a valid container response without a node field', () => {
    delete containerResponseMock.Node;
    container = new ContainerModel(containerResponseMock);
    expect(container.node).toBeFalsy();
  });

  it('should probably parse ports', () => {
    let ports = Object.keys(containerResponseMock.NetworkSettings.Ports);
    expect(container.ports.length).toBe(ports.length);

    // Ports: {
    //   '3000/tcp': null,
    //     '8000/udp': [
    //     {
    //       HostPort: '8080',
    //       HostIp: '1.3.3.7'
    //     }
    //   ]
    // }

    expect(container.ports[0][0].port).toBe(3000);
    expect(container.ports[0][0].protocol).toBe('tcp');
    // no host port mapping
    expect(container.ports[0][1]).toBeFalsy();

    expect(container.ports[1][0].port).toBe(8000);
    expect(container.ports[1][0].protocol).toBe('udp');
    // host port mapping
    expect(container.ports[1][1]).toBeTruthy();
    expect(container.ports[1][1].port).toBe(8080);
    expect(container.ports[1][1].ip).toBe('1.3.3.7');
  });

  it('should be able to call actions container (they should be passed to dockerode Container)', async () => {
    expect(containerResponseMock.stop).toNotHaveBeenCalled();
    await container.stop();
    expect(containerResponseMock.stop).toHaveBeenCalled();

    expect(containerResponseMock.start).toNotHaveBeenCalled();
    await container.start();
    expect(containerResponseMock.start).toHaveBeenCalled();

    expect(containerResponseMock.pause).toNotHaveBeenCalled();
    await container.pauseContainer();
    expect(containerResponseMock.pause).toHaveBeenCalled();

    expect(containerResponseMock.unpause).toNotHaveBeenCalled();
    await container.unPauseContainer();
    expect(containerResponseMock.unpause).toHaveBeenCalled();

    expect(containerResponseMock.stats).toNotHaveBeenCalled();
    await container.stats();
    expect(containerResponseMock.stats).toHaveBeenCalled();

    expect(containerResponseMock.top).toNotHaveBeenCalled();
    await container.top();
    expect(containerResponseMock.top).toHaveBeenCalled();
  });
});
