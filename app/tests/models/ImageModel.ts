import expect from 'expect';
import { getImageResponseMock } from '../mocks/DockerFacade';
import { ImageModel } from '../../src/models/ImageModel';

describe('ImageModel.ts', () => {
  let imageResponseMock;
  let image: ImageModel;

  beforeEach(() => {
    imageResponseMock = getImageResponseMock();
    image = new ImageModel(imageResponseMock);
  });

  it('should probably parse a valid image response into an image', () => {
    expect(image.id).toBe(imageResponseMock.Id);
    expect(image.name).toBe('test');
    expect(image.tags).toEqual([ '0.15', 'latest' ]);
    expect(image.arch).toBe(imageResponseMock.Architecture);
    expect(image.os).toBe(imageResponseMock.Os);
    expect(image.entrypoints).toEqual(imageResponseMock.Config.Entrypoint);
    expect(image.exposedPorts).toEqual([ {port: 9000, protocol: 'tcp'}, { port: 8080, protocol: 'udp'}]);
    expect(image.workingDir).toBe(imageResponseMock.Config.WorkingDir);
    expect(image.cmd).toEqual(imageResponseMock.Config.Cmd);
  });

  it('should be able to call actions (they should be passed to dockerode)', async () => {
    expect(imageResponseMock.history).toNotHaveBeenCalled();
    await image.getHistory();
    expect(imageResponseMock.history).toHaveBeenCalled();
  });
});
