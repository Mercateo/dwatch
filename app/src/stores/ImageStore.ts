import { DockerFacade, DockerEvent, DockerSwarmEvent } from '../utils/DockerFacade';
import { transaction, map } from 'mobx/lib/mobx';
import { inject, provideSingleton } from '../utils/IOC';
import { ImageModel } from '../models/ImageModel';

@provideSingleton(ImageStore)
export class ImageStore {
  @inject(DockerFacade)
  private docker: DockerFacade;

  images = map<ImageModel>();

  danglingImages = map<ImageModel>();

  constructor () {
    this.docker.onEvent(event => {
      switch ((<DockerEvent> event).Action || (<DockerSwarmEvent> event).status) {
        case 'pull':
        case 'untag':  
          this.loadImage(event.id);
          break;
        case 'delete':
          this.images.delete(event.id);
          this.danglingImages.delete(event.id);
          break;
      }
    });
  }

  async loadImages (): Promise<void> {
    let images: Array<ImageModel> = (await this.docker.listImages())
      .map(image => new ImageModel(image));

    transaction(() => {
      this.images.clear();

      for (let image of images) {
        this.images.set(image.id, image);
      }
    });
  }

  async loadDanglingImages (): Promise<void> {
    let images: Array<ImageModel> = (await this.docker.listDanglingImages())
      .map(image => new ImageModel(image));

    transaction(() => {
      this.danglingImages.clear();

      for (let image of images) {
        this.danglingImages.set(image.id, image);
      }
    });
  }

  async loadImage (imageId: string): Promise<void> {
    await this.loadImages();
    await this.loadDanglingImages();

    const image = this.images.get(imageId) || this.danglingImages.get(imageId);

    if(image == null) {
      throw new Error('Container not found.');
    }
  }

  async removeImage (imageId: string): Promise<void> {
    const image = this.images.get(imageId) || this.danglingImages.get(imageId);

    if (image == null) {
      throw new Error(`No image found for ${imageId}.`);
    }

    await this.docker.removeImage(imageId);
  }
}
