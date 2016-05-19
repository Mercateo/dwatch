import expect from 'expect';
import { Version, DockerFacade } from '../../src/utils/DockerFacade';
import { DockerSystemStore } from '../../src/stores/DockerSystemStore';
import { getVersionResponseMock } from '../mocks/DockerFacade';
import { bindMock } from '../mocks/Helper';
import { kernel } from '../../src/utils/IOC';
import { Mock } from 'emock';

describe('DockerSystemStore.ts', () => {
  let store;
  let dockerFacadeMock: Mock<DockerFacade>;
  let versionResponseMock;

  beforeEach(() => {
    kernel.snapshot();
    versionResponseMock = getVersionResponseMock();
    dockerFacadeMock = Mock.of(DockerFacade);

    bindMock(DockerFacade, dockerFacadeMock.mock);

    kernel.unbind(DockerSystemStore);
    kernel.bind(DockerSystemStore).to(DockerSystemStore).inSingletonScope();
    store = kernel.get(DockerSystemStore);
  });

  it('should probably load docker system version and publish it', async () => {
    let versionSpy = dockerFacadeMock.spyOn(x => x.version()).andReturn(new Promise<Version>((resolve) => resolve(versionResponseMock)));

    await store.loadVersion();

    expect(versionSpy).toHaveBeenCalled();
    expect(store.version).toEqual(versionResponseMock);
  });

  it('should probably pass through errors', async () => {
    dockerFacadeMock.spyOn(x => x.version()).andReturn(new Promise<Version>((resolve, reject) => reject(new Error('Test'))));

    try {
      await store.loadVersion();
      expect(1).toBe(2);
    } catch (e) {
      expect(e.message).toBe('Test');
    }

    expect(store.version).toBeFalsy();
  });

  afterEach(() => {
    kernel.restore();
  });
});
