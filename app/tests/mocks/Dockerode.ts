import { createSpy } from 'expect';

export function getDockerodeContainerDataMock(): any {
  return {};
}

class DockerodeMock {
  getContainer = createSpy();
  
  version = createSpy();
  
  listContainers = createSpy();
  
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
