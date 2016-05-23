import expect, { extend, spyOn } from 'expect';
import { getContainerResponseMock } from '../mocks/DockerFacade';
import { ContainerStore } from '../../src/stores/ContainerStore';
import { ContainerModel } from '../../src/models/ContainerModel';
import { DockerSwarmEvent, DockerEvent, DockerFacade } from '../../src/utils/DockerFacade';
import { kernel } from '../../src/utils/IOC';
import { bindMock, getDockerEvent, getDockerSwarmEvent } from '../mocks/Helper';
import { Mock, expectExtensions } from 'emock';

extend(expectExtensions);

describe('ContainerStore.ts', () => {
  let store: ContainerStore;
  let containerResponseMock;
  let dockerFacadeMock: Mock<DockerFacade>;

  beforeEach(() => {
    kernel.snapshot();
    containerResponseMock = getContainerResponseMock();

    dockerFacadeMock = Mock.of(DockerFacade);

    bindMock(DockerFacade, dockerFacadeMock.mock);
    
    store = kernel.get(ContainerStore);
  });

  it('should probably load a container and publish it to containers', async () => {
    let getContainerSpy = dockerFacadeMock.spyOn(x => x.getContainer(containerResponseMock.Id))
                                          .andReturn(new Promise((resolve) => resolve(containerResponseMock)));

    await store.loadContainer(containerResponseMock.Id);

    // assertion needed as long as typings are not fixed, see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/9331
    (<any>expect(getContainerSpy)).toHaveBeenCalledWithSignature();
    expect(store.containers.get(containerResponseMock.Id)).toBeA(ContainerModel);
  });

  it('should probably load containers and publish it to containers', async () => {
    let secondContainer: any = getContainerResponseMock();
    secondContainer.Id = 'myId2';

    let listAllContainerSpy = dockerFacadeMock.spyOn(x => x.listAllContainers())
                                              .andReturn(new Promise((resolve) => resolve([ containerResponseMock, secondContainer ])));

    await store.loadContainers();

    (<any>expect(listAllContainerSpy)).toHaveBeenCalledWithSignature();

    expect(store.containers.size).toBe(2);
    expect(store.containers.get(containerResponseMock.Id)).toBeA(ContainerModel);
    expect(store.containers.get(secondContainer.Id)).toBeA(ContainerModel);
  });

  it('should let me remove containers (if present or fail)', async () => {
    dockerFacadeMock.spyOn(x => x.getContainer(containerResponseMock.Id))
                    .andReturn(new Promise((resolve) => resolve(containerResponseMock)));
    let removeContainerSpy = dockerFacadeMock.spyOn(x => x.removeContainer(containerResponseMock.Id));

    await store.loadContainer(containerResponseMock.Id);
    await store.removeContainer(containerResponseMock.Id);

    (<any>expect(removeContainerSpy)).toHaveBeenCalledWithSignature();

    // assertion needed as long as typings are not fixed, see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/9331
    (<any>removeContainerSpy).reset();

    try {
      await store.removeContainer('not found');
      expect(1).toBe(2);
    } catch (e) {
      expect(e.message).toInclude('No container found for');
    }

    expect(removeContainerSpy).toNotHaveBeenCalled();
  });

  it('should listen to events', async () => {
    let onEventSpy = dockerFacadeMock.spyOn(x => x.onEvent((e: DockerEvent|DockerSwarmEvent) => {}));
    expect(onEventSpy).toHaveBeenCalled();

    let onEventCallback: (event: DockerEvent | DockerSwarmEvent) => void = onEventSpy.calls[0].arguments[0];

    dockerFacadeMock.spyOn(x => x.getContainer(containerResponseMock.Id))
                    .andReturn(new Promise((resolve) => resolve(containerResponseMock)));

    let loadContainerSpy = spyOn(store, 'loadContainer').andCallThrough();

    await store.loadContainer(containerResponseMock.Id);
    (<any>loadContainerSpy).reset();

    expect(store.containers.size).toBe(1);

    [ 'pause', 'unpause', 'start', 'die', 'kill' ].forEach(action => {
      // test for local docker installation
      onEventCallback(getDockerEvent(containerResponseMock.Id, action));
      expect(store.loadContainer).toHaveBeenCalled();
      (<any>loadContainerSpy).reset();


      // test for swarm cluster
      onEventCallback(getDockerSwarmEvent(containerResponseMock.Id, action));
      expect(store.loadContainer).toHaveBeenCalled();
      (<any>loadContainerSpy).reset();
    });

    onEventCallback(getDockerEvent(containerResponseMock.Id, 'destroy'));
    expect(store.containers.size).toBe(0);

    await store.loadContainer(containerResponseMock.Id);

    onEventCallback(getDockerSwarmEvent(containerResponseMock.Id, 'destroy'));
    expect(store.containers.size).toBe(0);
  });

  afterEach(() => {
    kernel.restore();
  });
});
