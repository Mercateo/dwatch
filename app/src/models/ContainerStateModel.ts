import { Container } from '../utils/DockerFacade';
import { CONTAINER_RUN_STATE, CONTAINER_STATE } from './ContainerModel';

export class ContainerStateModel {
  runState: CONTAINER_RUN_STATE = CONTAINER_RUN_STATE.STOPPED;
  state: CONTAINER_STATE = CONTAINER_STATE.CREATED;
  exitCode: number = 0;
  finishedAt: Date;
  startedAt: Date;

  constructor (config: Container) {
    if (config.State.Running && !config.State.Paused) {
      this.runState = CONTAINER_RUN_STATE.RUNNING;
    } else if (config.State.Restarting) {
      this.runState = CONTAINER_RUN_STATE.RESTARTING;
    } else if (config.State.Running && config.State.Paused) {
      this.runState = CONTAINER_RUN_STATE.PAUSED;
    } else if (config.State.Dead) {
      this.runState = CONTAINER_RUN_STATE.DEAD;
    }

    this.finishedAt = new Date(config.State.FinishedAt);
    this.startedAt = new Date(config.State.StartedAt);
    this.exitCode = config.State.ExitCode;

    switch (config.State.Status) {
      case 'exited':
        this.state = CONTAINER_STATE.EXITED;
        break;
      case 'created':
        this.state = CONTAINER_STATE.CREATED;
        break;
      case 'running':
        this.state = CONTAINER_STATE.RUNNING;
        break;
    }
  }
}
