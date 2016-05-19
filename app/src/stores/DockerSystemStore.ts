import { observable } from 'mobx/lib/mobx';
import { Version, DockerFacade } from '../utils/DockerFacade';
import { provideSingleton, inject } from '../utils/IOC';

@provideSingleton(DockerSystemStore)
export class DockerSystemStore {
  @inject(DockerFacade)
  private docker: DockerFacade;

  @observable
  version: Version;

  async loadVersion(): Promise<void> {
    this.version = await this.docker.version();
  }

  // async loadInfo(): Promise<void> {
  //   console.log(await this.docker.info());
  // }
}
