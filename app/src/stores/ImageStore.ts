import { DockerFacade, DockerEvent, DockerSwarmEvent } from '../utils/DockerFacade';
import { transaction, map, observable, asMap, ObservableMap } from 'mobx/lib/mobx';
import { inject, provideSingleton } from '../utils/IOC';
import { ImageModel } from '../models/ImageModel';

@provideSingleton(ImageStore)
export class ImageStore {
  @inject(DockerFacade)
  private docker: DockerFacade;

  @observable
  images = asMap<ImageModel>();

  constructor () {
    this.docker.onEvent(event => {
      switch ((<DockerEvent> event).Action || (<DockerSwarmEvent> event).status) {
        case 'pull':
        case 'untag':
        case 'tag':
          this.loadImage(event.id);
          break;
        case 'delete':
          this.images.delete(event.id);
          break;
      }
    });
  }

  async loadImages (): Promise<void> {
    // there is now way to get dangling state from remote api without querying for dangling images,
    // because its a information from the image store not the image itself
    // (see https://github.com/docker/docker/issues/22859#issuecomment-220682319)
    let danglingImages = await this.docker.listDanglingImages();
    let images: Array<ImageModel> = (await this.docker.listImages())
      .map(image => new ImageModel(image))
      .map(image => {
        if(danglingImages.find(x => x.Id === image.id)) {
          image.dangling = true;
        }

        return image;
      });

    transaction(() => {
      this.images.clear();

      for (let image of images) {
        this.images.set(image.id, image);
      }
    });
  }

  async loadImage (imageId: string): Promise<void> {
    let image: ImageModel;

    try {
      image = new ImageModel(await this.docker.getImage(imageId));
    } catch(e) {
      throw new Error(`Image for ${imageId} not found.`);
    }

    let danglingImages = await this.docker.listDanglingImages();
    if(danglingImages.find(x => x.Id === image.id)) {
      image.dangling = true;
    }

    this.images.set(image.id, image);
  }

  async removeImage (imageId: string): Promise<void> {
    const image = this.images.get(imageId);

    if (image == null) {
      throw new Error(`No image found for ${imageId}.`);
    }

    await this.docker.removeImage(imageId);
  }
}
