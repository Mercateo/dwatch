declare module "dockerode" {
  interface ShortContainerDescription {
    Id: string
  }

  interface Dockerode {
    new (opts?: Object): Dockerode;

    getContainer(containerId: string): any;
    listContainers(query: any, cb: (err: Error, data: Array<ShortContainerDescription>) => void): void;
    info(cb: (err: Error, data: any) => void): void;
    version(cb: (err: Error, data: any) => void): void;
    modem: any;
  }

  let Dockerode: Dockerode;
  export default Dockerode;
}
