import { Kernel, makePropertyInjectDecorator, INewable } from 'inversify';
import { makeFluentProvideDecorator } from 'inversify-binding-decorators';
import Dockerode from 'dockerode';

export const kernel = new Kernel();

// bind 3rd party deps
kernel.bind(Dockerode).toConstantValue(Dockerode);

const provide = makeFluentProvideDecorator(kernel);

export function provideInstance (identifier: string|Symbol|INewable<any>) {
  return provide(identifier).done();
}

export function provideSingleton (identifier: string|Symbol|INewable<any>) {
  return provide(identifier).inSingletonScope().done();
}

export const inject = makePropertyInjectDecorator(kernel);
