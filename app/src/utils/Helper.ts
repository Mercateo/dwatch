import JSONStream from 'JSONStream';
import { LOCALE } from '../stores/SettingsStore';

export interface Port {
  port: number;
  protocol: string
}

/**
 * Parses a docker port `9000/tcp` to an `Port` object.
 * @param portString
 * @returns {{port: number, protocol}}
 */
export function normalizePort (portString: string): Port {
  if (!portString.includes('/')) {
    throw new Error('Invalid port string');
  }

  const [ port, protocol ] = portString.split('/');
  const parsedPort = parseInt(port);

  if (isNaN(parsedPort)) {
    throw new Error('Port is NaN');
  }

  return {
    port: parseInt(port),
    protocol
  };
}

/**
 * Normalizes a docker container name (removes the leading slash).
 * @param name
 * @returns {string}
 */
export function normalizeContainerName (name: string): string {
  return name.replace('/', '');
}

export function parseLocale (locale: LOCALE): {fullLocale: string, country: string, language: string} {
  let [ language, country ] = LOCALE[ locale ]
    .split('_');

  return {
    country,
    language: language.toLowerCase(),
    fullLocale: `${language.toLowerCase()}_${country}`,
  };
}

// taken from https://github.com/apocas/docker-modem/blob/master/lib/modem.js#L281
// no tests
/* istanbul ignore next */
export function dockerStream (stream: any, onFinished: (err: any, data: any) => void, onProgress: (event: any) => void) {
  var parser = JSONStream.parse(),
    output: any = [];

  parser.on('root', onStreamEvent);
  parser.on('error', onStreamError);
  parser.on('end', onStreamEnd);

  stream.pipe(parser);

  function onStreamEvent (evt: any) {
    if (!(evt instanceof Object)) {
      evt = {};
    }

    output.push(evt);

    if (evt.error) {
      return onStreamError(evt.error);
    }

    if (onProgress) {
      onProgress(evt);
    }
  }

  function onStreamError (err: any) {
    parser.removeListener('root', onStreamEvent);
    parser.removeListener('error', onStreamError);
    parser.removeListener('end', onStreamEnd);
    onFinished(err, output);
  }

  function onStreamEnd () {
    onFinished(null, output);
  }
}

/**
 * Parses bytes. For example:
 * 1000000 bytes -> { size: 976.6, unit: 'kB' }
 *
 * @param bytes
 * @returns {{size: number, unit: (string|string|string|string|string|string|string|string)}}
 */
export function parseBytes (bytes: number): { size: number, unit: string } {
  let i = -1;
  const byteUnits = [ 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ];

  do {
    bytes = bytes / 1024;
    i++;
  } while (bytes > 1024);

  return {
    size: parseFloat(Math.max(bytes, 0.1).toFixed(1)),
    unit: byteUnits[ i ]
  };
}
