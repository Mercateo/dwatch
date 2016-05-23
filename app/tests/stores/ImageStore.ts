import expect, { extend, spyOn } from 'expect';
import { getImageResponseMock } from '../mocks/DockerFacade';
import { DockerFacade, DockerEvent, DockerSwarmEvent } from '../../src/utils/DockerFacade';
import { kernel } from '../../src/utils/IOC';
import { bindMock, getDockerEvent, getDockerSwarmEvent } from '../mocks/Helper';
import { Mock, expectExtensions } from 'emock';
import { ImageStore } from '../../src/stores/ImageStore';
import { ImageModel } from '../../src/models/ImageModel';

extend(expectExtensions);

describe('ImageStore.ts', () => {
  let store: ImageStore;
  let imageResponseMock;
  let dockerFacadeMock: Mock<DockerFacade>;

  beforeEach(() => {
    kernel.snapshot();
    imageResponseMock = getImageResponseMock();

    dockerFacadeMock = Mock.of(DockerFacade);

    bindMock(DockerFacade, dockerFacadeMock.mock);

    store = kernel.get(ImageStore);
  });

  it('should probably load an image and publish it to images', async () => {
    let listDanglingImagesSpy = dockerFacadeMock.spyOn(x => x.listDanglingImages())
                                                .andReturn(new Promise((resolve) => resolve([])));
    let getImageSpy = dockerFacadeMock.spyOn(x => x.getImage(imageResponseMock.Id))
                                      .andReturn(new Promise((resolve) => resolve(imageResponseMock)));

    await store.loadImage(imageResponseMock.Id);

    // assertion needed as long as typings are not fixed, see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/9331
    (<any>expect(getImageSpy)).toHaveBeenCalledWithSignature();
    (<any>expect(listDanglingImagesSpy)).toHaveBeenCalledWithSignature();
    expect(store.images.get(imageResponseMock.Id)).toBeA(ImageModel);
    expect(store.images.get(imageResponseMock.Id).dangling).toBeFalsy();

    listDanglingImagesSpy.andReturn(new Promise((resolve) => resolve([ { Id: imageResponseMock.Id } ])));

    await store.loadImage(imageResponseMock.Id);

    // assertion needed as long as typings are not fixed, see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/9331
    (<any>expect(getImageSpy)).toHaveBeenCalledWithSignature();
    expect(store.images.get(imageResponseMock.Id)).toBeA(ImageModel);
    expect(store.images.get(imageResponseMock.Id).dangling).toBeTruthy();

    dockerFacadeMock.spyOn(x => x.getImage('not found'))
                                  .andReturn(new Promise((resolve, reject) => reject('not found')));

    try {
      await store.loadImage('not found');
      expect(1).toBe(2);
    } catch (e) {
      expect(e.message).toInclude('Image for');
    }
  });

  it('should probably load images and publish it to images', async () => {
    let secondImage: any = getImageResponseMock();
    secondImage.Id = 'myId2';

    let listImagesSpy = dockerFacadeMock.spyOn(x => x.listImages())
                                        .andReturn(new Promise((resolve) => resolve([ imageResponseMock, secondImage ])));
    let listDanglingImagesSpy = dockerFacadeMock.spyOn(x => x.listDanglingImages())
                                            .andReturn(new Promise((resolve) => resolve([ secondImage ])));

    await store.loadImages();

    (<any>expect(listDanglingImagesSpy)).toHaveBeenCalledWithSignature();
    (<any>expect(listImagesSpy)).toHaveBeenCalledWithSignature();

    expect(store.images.size).toBe(2);
    expect(store.images.get(imageResponseMock.Id)).toBeA(ImageModel);
    expect(store.images.get(secondImage.Id)).toBeA(ImageModel);
    expect(store.images.get(secondImage.Id).dangling).toBeTruthy();
    expect(store.images.get(imageResponseMock.Id).dangling).toBeFalsy();
  });

    it('should let me remove images (if present or fail)', async () => {
      dockerFacadeMock.spyOn(x => x.getImage(imageResponseMock.Id))
                      .andReturn(new Promise((resolve) => resolve(imageResponseMock)));
      dockerFacadeMock.spyOn(x => x.listDanglingImages())
                      .andReturn(new Promise((resolve) => resolve([])));
      let removeImageSpy = dockerFacadeMock.spyOn(x => x.removeImage(imageResponseMock.Id));

      await store.loadImage(imageResponseMock.Id);
      await store.removeImage(imageResponseMock.Id);

      (<any>expect(removeImageSpy)).toHaveBeenCalledWithSignature();

      // assertion needed as long as typings are not fixed, see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/9331
      (<any>removeImageSpy).reset();

      try {
        await store.removeImage('not found');
        expect(1).toBe(2);
      } catch (e) {
        expect(e.message).toInclude('No image found');
      }

      expect(removeImageSpy).toNotHaveBeenCalled();
    });

    it('should listen to events', async () => {
      let onEventSpy = dockerFacadeMock.spyOn(x => x.onEvent((e: DockerEvent|DockerSwarmEvent) => {}));
      expect(onEventSpy).toHaveBeenCalled();

      let onEventCallback: (event: DockerEvent | DockerSwarmEvent) => void = onEventSpy.calls[0].arguments[0];

      dockerFacadeMock.spyOn(x => x.getImage(imageResponseMock.Id))
                      .andReturn(new Promise((resolve) => resolve(imageResponseMock)));
      dockerFacadeMock.spyOn(x => x.listDanglingImages())
                      .andReturn(new Promise((resolve) => resolve([])));

      let loadImageSpy = spyOn(store, 'loadImage').andCallThrough();

      await store.loadImage(imageResponseMock.Id);
      (<any>loadImageSpy).reset();

      expect(store.images.size).toBe(1);

      [ 'pull', 'untag' ].forEach(action => {
        // test for local docker installation
        onEventCallback(getDockerEvent(imageResponseMock.Id, action));
        expect(store.loadImage).toHaveBeenCalled();
        (<any>loadImageSpy).reset();


        // test for swarm cluster
        onEventCallback(getDockerSwarmEvent(imageResponseMock.Id, action));
        expect(store.loadImage).toHaveBeenCalled();
        (<any>loadImageSpy).reset();
      });

      onEventCallback(getDockerEvent(imageResponseMock.Id, 'delete'));
      expect(store.images.size).toBe(0);

      await store.loadImage(imageResponseMock.Id);

      onEventCallback(getDockerSwarmEvent(imageResponseMock.Id, 'delete'));
      expect(store.images.size).toBe(0);
  });

  afterEach(() => {
    kernel.restore();
  });
});
