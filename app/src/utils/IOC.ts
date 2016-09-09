import { Kernel, interfaces } from 'inversify';
import { makeFluentProvideDecorator } from 'inversify-binding-decorators';
import Dockerode from 'dockerode';
import getDecorators from 'inversify-inject-decorators';

export const kernel = new Kernel();

export const Fetch = <Symbol>Symbol();

// bind 3rd party deps
kernel.bind(Dockerode).toConstantValue(Dockerode);
kernel.bind(Fetch).toConstantValue(fetch.bind(window));

const provide = makeFluentProvideDecorator(kernel);

export function provideInstance (identifier: string|Symbol|interfaces.Newable<any>) {
  return provide(identifier).done();
}

export function provideSingleton (identifier: string|Symbol|interfaces.Newable<any>) {
  return provide(identifier).inSingletonScope().done();
}

export const inject = getDecorators(kernel).lazyInject;
