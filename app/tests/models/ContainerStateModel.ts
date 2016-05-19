import expect from 'expect';
import { ContainerStateModel } from '../../src/models/ContainerStateModel';
import { getContainerResponseMock } from '../mocks/DockerFacade';
import { CONTAINER_RUN_STATE, CONTAINER_STATE } from '../../src/models/ContainerModel';

describe('ContainerStateModel.ts', () => {
  let containerResponseMock;

  beforeEach(() => {
    containerResponseMock = getContainerResponseMock();
  });

  it('should probably parse a valid container response (and running state)', () => {
    let state = new ContainerStateModel(containerResponseMock);
    expect(state.exitCode).toBe(containerResponseMock.State.ExitCode);
    expect(state.finishedAt).toEqual(containerResponseMock.State.FinishedAt);
    expect(state.startedAt).toEqual(containerResponseMock.State.StartedAt);
    expect(state.state).toBe(CONTAINER_STATE.RUNNING);

    // initial state is running
    expect(state.runState).toBe(CONTAINER_RUN_STATE.RUNNING);
  });

  it('should parse stopped state probably', () => {
    containerResponseMock.State.Running = false;
    let state = new ContainerStateModel(containerResponseMock);
    expect(state.runState).toBe(CONTAINER_RUN_STATE.STOPPED);
  });

  it('should parse paused state probably', () => {
    containerResponseMock.State.Paused = true;
    let state = new ContainerStateModel(containerResponseMock);
    expect(state.runState).toBe(CONTAINER_RUN_STATE.PAUSED);
  });

  it('should parse dead state probably', () => {
    containerResponseMock.State.Running = false;
    containerResponseMock.State.Dead = true;
    let state = new ContainerStateModel(containerResponseMock);
    expect(state.runState).toBe(CONTAINER_RUN_STATE.DEAD);
  });

  it('should parse restarting state probably', () => {
    containerResponseMock.State.Running = false;
    containerResponseMock.State.Restarting = true;
    let state = new ContainerStateModel(containerResponseMock);
    expect(state.runState).toBe(CONTAINER_RUN_STATE.RESTARTING);
  });

  it('should parse exited state probably', () => {
    containerResponseMock.State.Status = 'exited';
    let state = new ContainerStateModel(containerResponseMock);
    expect(state.state).toBe(CONTAINER_STATE.EXITED);
  });

  it('should parse created state probably', () => {
    containerResponseMock.State.Status = 'created';
    let state = new ContainerStateModel(containerResponseMock);
    expect(state.state).toBe(CONTAINER_STATE.CREATED);
  });
});
