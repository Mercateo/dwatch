import expect from 'expect';
import { kernel } from '../../src/utils/IOC';

// no support for nested objects (so far)
export function deepEqual (obj1: any, obj2: any) {
  expect(Object.keys(obj1).sort()).toEqual(Object.keys(obj2).sort());

  let keys = Object.keys(obj1);

  for (let key of keys) {
    expect(obj1[ key ]).toEqual(obj2[ key ]);
  }
}

export function getSingletonMock<T>(target: Symbol, mock: { new(...args: any[]): T; }): T {
  kernel.unbind(target);
  kernel.bind<T>(target).to(mock).inSingletonScope();
  return kernel.get<T>(target);
}

export function bindMock(target: any, mock: any) {
  kernel.unbind(target);
  kernel.bind(target).toConstantValue(mock);
}

export function getDockerEvent (id: string, action: string): any {
  return {
    id,
    Action: action
  };
}

export function getDockerSwarmEvent (id: string, status: string): any {
  return {
    id,
    status
  };
}
