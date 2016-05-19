declare module "JSONStream" {

  interface JSONStream {
    parse: () => any;
  }

  let s: JSONStream;
  export default s;
}
