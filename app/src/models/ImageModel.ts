import { Image } from '../utils/DockerFacade';
import { normalizeImageId } from '../utils/Helper';

export class ImageModel {
  id: string;
  tags: Array<string>;
  created: Date;
  size: number;
  dangling: boolean;

  constructor (private image: Image) {
    this.id = image.Id;
    this.tags = image.RepoTags;
    this.created = new Date(image.Created);
    this.size = image.Size;
    this.dangling = false;
  }

  history (): Promise<any> {
    return this.image.history();
  }
}
