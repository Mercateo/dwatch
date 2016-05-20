import { DockerEvent, DockerSwarmEvent, DockerFacade } from '../utils/DockerFacade';
import { transaction, map } from 'mobx/lib/mobx';
import { ContainerModel } from '../models/ContainerModel';
import { inject, provideSingleton } from '../utils/IOC';

@provideSingleton(ContainerStore)
export class ContainerStore  {
  @inject(DockerFacade)
  private docker: DockerFacade;

  containers = map<ContainerModel>();

  constructor () {
    this.docker.onEvent(event => {
      switch ((<DockerEvent> event).Action || (<DockerSwarmEvent> event).status) {
        case 'pause':
        case 'unpause':
        case 'start':
        case 'die':
        case 'kill':
          this.loadContainer(event.id);
          break;
        case 'destroy':
          this.containers.delete(event.id);
          break;
      }
    });
  }

  async loadContainers (): Promise<void> {
    let containers: Array<ContainerModel> = (await this.docker.listAllContainers())
      .map(container => new ContainerModel(container));

    transaction(() => {
      this.containers.clear();

      for (let container of containers) {
        this.containers.set(container.id, container);
      }
    });
  }

  async loadContainer (containerId: string): Promise<void> {
    try {
      const container = new ContainerModel(await this.docker.getContainer(containerId));
      this.containers.set(container.id, container);
    } catch (e) {
      throw new Error('Container not found.');
    }
  }

  async removeContainer (containerId: string): Promise<void> {
    const container = this.containers.get(containerId);

    if (container == null) {
      throw new Error(`No container found for ${containerId}.`);
    }

    await this.docker.removeContainer(containerId);
  }
}
