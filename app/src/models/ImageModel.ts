import { Image } from '../utils/DockerFacade';
import { parseRepoTags } from '../utils/Helper';

export class ImageModel {
  id: string;
  name: string;
  tags: Array<string>;
  created: Date;
  size: number;
  dangling: boolean;

  constructor (private image: Image) {
    this.id = image.Id;
    
    let parsedRepoTags = parseRepoTags(image.RepoTags);
    if(parsedRepoTags != null) {
      this.name = parsedRepoTags.name;
      this.tags = parsedRepoTags.tags;
    }
    
    this.created = new Date(image.Created);
    this.size = image.Size;
    this.dangling = false;
  }

  history (): Promise<any> {
    return this.image.history();
  }
}
