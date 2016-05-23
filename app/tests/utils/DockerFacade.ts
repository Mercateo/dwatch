import expect from 'expect';
import { Container, TopModel, DockerFacade, Version, Image } from '../../src/utils/DockerFacade';
import { getDockerTopMock, getVersionResponseMock, getImageHistoryMock } from '../mocks/DockerFacade';
import { getDockerodeMock, getDockerodeContainerDataMock, getDockerodeContainerMock, getDockerodeImageMock, getDockerodeImageDataMock } from '../mocks/Dockerode';
import { NotificationStore } from '../../src/stores/NotificationStore';
import { SettingsStore } from '../../src/stores/SettingsStore';
import { bindMock } from '../mocks/Helper';
import { kernel } from '../../src/utils/IOC';
import Dockerode from 'dockerode';
import { getSettingsMock } from '../mocks/SettingsStore';
import { spyOn } from 'expect';
import { Mock } from 'emock';

describe('DockerFacade.ts', () => {
  describe('Container', () => {
    let failActions = false;

    let container;
    let dockerodeContainerMock: Mock<Container>;
    let dockerTopMock;

    beforeEach(() => {
      failActions = false;

      dockerodeContainerMock = Mock.of(Container);
      dockerTopMock = getDockerTopMock();

      function simpleCb (cb: ((err: any) => void)) {
        if (!failActions) {
          cb(null);
        } else {
          cb('test');
        }
      }

      dockerodeContainerMock.spyOn(x => x.start()).andCall(simpleCb);
      dockerodeContainerMock.spyOn(x => x.stop()).andCall(simpleCb);
      dockerodeContainerMock.spyOn(x => x.pause()).andCall(simpleCb);
      dockerodeContainerMock.spyOn(x => x.unpause()).andCall(simpleCb);

      dockerodeContainerMock.spyOn(x => x.stats()).andCall((cb: (err: any, data: any) => void) => {
        if (!failActions) {
          cb(null, 'hello');
        } else {
          cb('test', null);
        }
      });

      dockerodeContainerMock.spyOn(x => x.top()).andCall((cb: (err: any, data: TopModel) => void) => {
        if (!failActions) {
          cb(null, dockerTopMock);
        } else {
          cb('test', null);
        }
      });

      container = new Container({}, dockerodeContainerMock.mock);
    });

    it('should be able to call container actions (successfully)', async () => {
      await Promise.all([ 'stop', 'start', 'pause', 'unpause' ].map(async (action) => {
        expect(dockerodeContainerMock.spyOn(x => x[ action ]())).toNotHaveBeenCalled();
        await container[ action ]();
        expect(dockerodeContainerMock.spyOn(x => x[ action ]())).toHaveBeenCalled();
      }));

      // TODO: type stream
      expect(dockerodeContainerMock.spyOn(x => x.stats())).toNotHaveBeenCalled();
      let response = await container.stats();
      expect(dockerodeContainerMock.spyOn(x => x.stats())).toHaveBeenCalled();
      expect(response).toBe('hello');

      expect(dockerodeContainerMock.spyOn(x => x.top())).toNotHaveBeenCalled();
      let top = await container.top();
      expect(dockerodeContainerMock.spyOn(x => x.top())).toHaveBeenCalled();
      expect(top).toEqual(dockerTopMock);
    });

    it('should be able to call container actions (and receive exceptions)', async () => {
      failActions = true;

      await Promise.all([ 'stop', 'start', 'pause', 'unpause' ].map(async (action) => {
        expect(dockerodeContainerMock.spyOn(x => x[ action ]())).toNotHaveBeenCalled();
        try {
          await container[ action ]();
        } catch (e) {
          expect(dockerodeContainerMock.spyOn(x => x[ action ]())).toHaveBeenCalled();
          expect(e).toBe('test');
        }
      }));

      expect(dockerodeContainerMock.spyOn(x => x.stats())).toNotHaveBeenCalled();
      try {
        await container.stats();
      } catch (e) {
        expect(dockerodeContainerMock.spyOn(x => x.stats())).toHaveBeenCalled();
        expect(e).toBe('test');
      }

      expect(dockerodeContainerMock.spyOn(x => x.top())).toNotHaveBeenCalled();
      try {
        await container.top();
      } catch (e) {
        expect(dockerodeContainerMock.spyOn(x => x.top())).toHaveBeenCalled();
        expect(e).toBe('test');
      }
    });
  });

  describe('Image', () => {
    let failActions = false;

    let image: Image;
    let dockerodeImageMock: Mock<Image>;
    let imageHistoryMock;

    beforeEach(() => {
      failActions = false;

      dockerodeImageMock = Mock.of(Image);
      imageHistoryMock = getImageHistoryMock();

      dockerodeImageMock.spyOn(x => x.history()).andCall((cb: (err: any, data: TopModel) => void) => {
        if (!failActions) {
          cb(null, imageHistoryMock);
        } else {
          cb('test', null);
        }
      });

      image = new Image({}, dockerodeImageMock.mock);
    });

    it('should be able to receive image history (and receive exceptions)', async () => {
      let historySpy = dockerodeImageMock.spyOn(x => x.history());
      expect(historySpy).toNotHaveBeenCalled();

      let history = await image.history();
      expect(historySpy).toHaveBeenCalled();
      expect(history).toEqual(imageHistoryMock);

      (<any>historySpy).reset();
      failActions = true;

      expect(historySpy).toNotHaveBeenCalled();
      try {
        await image.history();
      } catch (e) {
        expect(historySpy).toHaveBeenCalled();
        expect(e).toBe('test');
      }
    });
  });

  describe('DockerFacade', () => {
    let dockerFacade: DockerFacade;
    let notificationStoreMock;
    let settingsStoreMock;
    let dockerodeMock;
    let dockerodeContainerMock;
    let dockerodeInstance;
    let dockerodeContainerDataMock;
    let dockerodeImageMock;
    let dockerodeImageDataMock;
    let versionResponseMock;
    let failActions;

    beforeEach(() => {
      failActions = false;
      kernel.snapshot();

      dockerodeMock = getDockerodeMock();
      dockerodeContainerMock = getDockerodeContainerMock();

      dockerodeImageMock = getDockerodeImageMock();
      dockerodeImageDataMock = getDockerodeImageDataMock();

      dockerodeContainerDataMock = getDockerodeContainerDataMock();
      versionResponseMock = getVersionResponseMock();

      settingsStoreMock = getSettingsMock();

      bindMock(SettingsStore, settingsStoreMock);

      notificationStoreMock = kernel.get(NotificationStore);

      kernel.unbind(Dockerode);
      kernel.bind(Dockerode).toConstantValue(dockerodeMock);

      dockerFacade = kernel.get(DockerFacade);

      dockerodeInstance = (<any>dockerFacade).dockerode;
    });

    beforeEach(() => {
      dockerodeInstance.getContainer.andReturn(dockerodeContainerMock);
      dockerodeInstance.getImage.andReturn(dockerodeImageMock);

      dockerodeInstance.listContainers.andCall((options: Object, cb: (err: any, containers: Array<any>) => void) => {
        if (!failActions) {
          cb(null, [ { Id: 'test' }, { Id: 'test2' } ]);
        } else {
          cb('test', null)
        }
      });

      dockerodeInstance.version.andCall((cb: (err: any, data: Version) => void) => {
        if (!failActions) {
          cb(null, versionResponseMock);
        } else {
          cb('test', null);
        }
      });

      dockerodeInstance.listImages.andCall((query: Object, cb: (err: any, data: any) => void) => {
        if (!failActions) {
          cb(null, [ { Id: 'sha256:test' }, { Id: 'sha256:test2' } ]);
        } else {
          cb('test', null);
        }
      });

      dockerodeContainerMock.inspect.andCall((query: Object, cb: (err: any, data: any) => void) => {
        if (!failActions) {
          cb(null, dockerodeContainerDataMock);
        } else {
          cb('test', null);
        }
      });

      dockerodeContainerMock.remove.andCall((query: Object, cb: (err: any) => void) => {
        if (!failActions) {
          cb(null);
        } else {
          cb('test');
        }
      });

      dockerodeImageMock.inspect.andCall((cb: (err: any, data: any) => void) => {
        if (!failActions) {
          cb(null, dockerodeImageDataMock);
        } else {
          cb('test', null);
        }
      });

      dockerodeImageMock.remove.andCall((query: Object, cb: (err: any) => void) => {
        if (!failActions) {
          cb(null);
        } else {
          cb('test');
        }
      });
    });

    it('should let me fetch a container by id', async () => {
      expect(dockerodeInstance.getContainer).toNotHaveBeenCalled();
      expect(dockerodeContainerMock.inspect).toNotHaveBeenCalled();

      let container: Container = await dockerFacade.getContainer('test');

      expect(dockerodeInstance.getContainer).toHaveBeenCalledWith('test');
      expect(dockerodeContainerMock.inspect).toHaveBeenCalled();
      expect(container).toBeA(Container);

      failActions = true;
      try {
        await dockerFacade.getContainer('test');
      } catch (e) {
        expect(e).toBe('test');
      }
    });

    it('should let me remove a container by id', async () => {
      expect(dockerodeInstance.getContainer).toNotHaveBeenCalled();
      expect(dockerodeContainerMock.remove).toNotHaveBeenCalled();

      await dockerFacade.removeContainer('test');

      expect(dockerodeInstance.getContainer).toHaveBeenCalledWith('test');
      expect(dockerodeContainerMock.remove).toHaveBeenCalled();

      failActions = true;
      try {
        await dockerFacade.removeContainer('test');
      } catch (e) {
        expect(e).toBe('test');
      }
    });

    it('should let me fetch docker info', async () => {
      expect(dockerodeInstance.version).toNotHaveBeenCalled();

      let version: Version = await dockerFacade.version();

      expect(dockerodeInstance.version).toHaveBeenCalled();
      expect(version).toEqual(versionResponseMock);

      failActions = true;
      try {
        await dockerFacade.version();
      } catch (e) {
        expect(e).toBe('test');
      }
    });

    it('should let me fetch all containers', async () => {
      let spy = spyOn(dockerFacade, 'getContainer').andReturn(new Promise((resolve, reject) => resolve({})));

      expect(dockerodeInstance.listContainers).toNotHaveBeenCalled();
      expect(dockerFacade.getContainer).toNotHaveBeenCalled();

      let containers: Array<Container> = await dockerFacade.listAllContainers();

      expect(dockerodeInstance.listContainers).toHaveBeenCalled();
      expect(spy.calls.length).toBe(2);
      expect(spy.calls[ 0 ].arguments).toEqual([ 'test' ]);
      expect(spy.calls[ 1 ].arguments).toEqual([ 'test2' ]);
      expect(containers).toEqual([ {}, {} ]);

      failActions = true;
      try {
        await dockerFacade.listAllContainers();
      } catch (e) {
        expect(e).toBe('test');
      }
    });

    it('should let me fetch an image by id', async () => {
      expect(dockerodeInstance.getImage).toNotHaveBeenCalled();
      expect(dockerodeImageMock.inspect).toNotHaveBeenCalled();

      let image: Image = await dockerFacade.getImage('test');

      expect(dockerodeInstance.getImage).toHaveBeenCalledWith('test');
      expect(dockerodeImageMock.inspect).toHaveBeenCalled();
      expect(image).toBeA(Image);

      failActions = true;
      try {
        await dockerFacade.getImage('test');
      } catch (e) {
        expect(e).toBe('test');
      }
    });

    it('should let me remove an image by id', async () => {
      expect(dockerodeInstance.getImage).toNotHaveBeenCalled();
      expect(dockerodeImageMock.remove).toNotHaveBeenCalled();

      await dockerFacade.removeImage('test');

      expect(dockerodeInstance.getImage).toHaveBeenCalledWith('test');
      expect(dockerodeImageMock.remove).toHaveBeenCalled();

      failActions = true;
      try {
        await dockerFacade.removeImage('test');
      } catch (e) {
        expect(e).toBe('test');
      }
    });

    it('should let me fetch all images', async () => {
      let spy = spyOn(dockerFacade, 'getImage').andReturn(new Promise((resolve, reject) => resolve({})));

      expect(dockerodeInstance.listImages).toNotHaveBeenCalled();
      expect(dockerFacade.getImage).toNotHaveBeenCalled();

      let containers: Array<Image> = await dockerFacade.listImages();

      expect(dockerodeInstance.listImages).toHaveBeenCalled();
      expect(spy.calls.length).toBe(2);
      expect(spy.calls[ 0 ].arguments).toEqual([ 'sha256:test' ]);
      expect(spy.calls[ 1 ].arguments).toEqual([ 'sha256:test2' ]);
      expect(containers).toEqual([ {}, {} ]);

      failActions = true;
      try {
        await dockerFacade.listImages();
      } catch (e) {
        expect(e).toBe('test');
      }
    });

    it('should let me fetch all dangling images', async () => {
      let spy = spyOn(dockerFacade, 'getImage').andReturn(new Promise((resolve, reject) => resolve({})));

      expect(dockerodeInstance.listImages).toNotHaveBeenCalled();
      expect(dockerFacade.getImage).toNotHaveBeenCalled();

      let containers: Array<Image> = await dockerFacade.listDanglingImages();

      expect(dockerodeInstance.listImages).toHaveBeenCalled();
      expect(dockerodeInstance.listImages.getLastCall().arguments[0]).toEqual({ filters: { dangling: [ 'true' ]}});
      expect(spy.calls.length).toBe(2);
      expect(spy.calls[ 0 ].arguments).toEqual([ 'sha256:test' ]);
      expect(spy.calls[ 1 ].arguments).toEqual([ 'sha256:test2' ]);
      expect(containers).toEqual([ {}, {} ]);

      failActions = true;
      try {
        await dockerFacade.listImages();
      } catch (e) {
        expect(e).toBe('test');
      }
    });

    afterEach(() => {
      kernel.restore();
    });
  });
});
