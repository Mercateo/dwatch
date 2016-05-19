import expect from 'expect';
import { normalizePort, parseBytes, normalizeContainerName, parseLocale } from '../../src/utils/Helper';
import { LOCALE } from '../../src/stores/SettingsStore';

describe('Helper.ts', () => {
  describe('normalizePort', () => {
    it('should probably parse port and protocol out of string', () => {
      let port = '9000/tcp';
      let parsedPort = normalizePort(port);

      expect(parsedPort.port).toBe(9000);
      expect(parsedPort.protocol).toBe('tcp');
    });

    it('should throw with non fitting string passed in', () => {
      expect(() => normalizePort('foo')).toThrow();
      expect(() => normalizePort('foo/tcp')).toThrow();
    });
  });

  describe('parseBytes', () => {
    it('should probably parse bytes', () => {
      const testBytes1 = parseBytes(1000000);
      expect(testBytes1.size).toBe(976.6);
      expect(testBytes1.unit).toBe('kB');

      const testBytes2 = parseBytes(10000000000);
      expect(testBytes2.size).toBe(9.3);
      expect(testBytes2.unit).toBe('GB');
    });
  });

  describe('normalizeContainerName', () => {
    it('should probably normalize container names', () => {
      const name1 = normalizeContainerName('/test');
      expect(name1).toBe('test');

      const name2 = normalizeContainerName('test');
      expect(name2).toBe('test');
    });
  });

  describe('parseLocale', () => {
    it('should probably parse a locale', () => {
      const locale = parseLocale(LOCALE.DE_DE);
      expect(locale.country).toBe('DE');
      expect(locale.language).toBe('de');
      expect(locale.fullLocale).toBe('de_DE');
    });
  });
});
