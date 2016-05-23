import { Image } from '../utils/DockerFacade';
import { parseRepoTags, Port, normalizePort } from '../utils/Helper';

export interface HistoryEntry {
  Comment: string;
  Created: number;
  CreatedBy: string;
  Id: string;
  Size: number;
  Tags: Array<string>;
}

export class ImageModel {
  id: string;
  name: string;
  tags: Array<string>;
  created: Date;
  size: number;
  dangling: boolean;

  author: string;
  os: string;
  arch: string;

  exposedPorts: Array<Port>;
  entrypoints: Array<string>;
  workingDir: string;
  volumes: Array<string>;
  cmd: Array<string>;
  user: string;
  environment: Array<string>;

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

    this.author = image.Author;
    this.os = image.Os;
    this.arch = image.Architecture;

    this.exposedPorts = Object.keys(image.Config.ExposedPorts || {})
                              .map(port => normalizePort(port));
    this.entrypoints = image.Config.Entrypoint || [];
    this.workingDir = image.Config.WorkingDir;
    this.volumes = Object.keys(image.Config.Volumes || {});
    this.cmd = image.Config.Cmd || [];
    this.user = image.Config.User;
    this.environment = image.Config.Env || [];
  }

  getHistory (): Promise<Array<HistoryEntry>> {
    return this.image.history();
  }
}
