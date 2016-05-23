import { createSpy } from 'expect';

export function getDockerodeContainerDataMock(): any {
  return {};
}

class DockerodeMock {
  getContainer = createSpy();

  version = createSpy();

  listContainers = createSpy();

  listImages = createSpy();

  getImage= createSpy();

  modem = {
    dial: createSpy()
  }
}

export function getDockerodeMock(): any {
  return DockerodeMock;
}

export function getDockerodeContainerMock (): any {
  return {
    remove: createSpy(),
    inspect: createSpy()
  };
}

export function getDockerodeImageMock (): any {
  return {
    remove: createSpy(),
    inspect: createSpy()
  };
}

export function getDockerodeImageDataMock(): any {
  return {};
}
