import expect from 'expect';
import { normalizePort, parseBytes, normalizeContainerName, parseLocale, normalizeImageId, parseRepoTags } from '../../src/utils/Helper';
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

  describe('normalizeImageId', () => {
    it('should probably normalize an image id', () => {
      let imageId1 = 'sha256:test';
      let imageId2 = 'test';
      let parsedImageId1 = normalizeImageId(imageId1);
      let parsedImageId2 = normalizeImageId(imageId2);

      expect(parsedImageId1).toBe('test');
      expect(parsedImageId2).toBe('test');
    });
  });

  describe('parseRepoTags', () => {
    it('should return null if parameter is null or array is empty', () => {
      expect(parseRepoTags(null)).toBe(null);
      expect(parseRepoTags([])).toBe(null);
    });

    it('should probably parse name and tags', () => {
      let repoTags = [ 'test:0.15', 'test:latest' ];
      let parsed = parseRepoTags(repoTags);

      expect(parsed.name).toBe('test');
      expect(parsed.tags.length).toBe(2);
      expect(parsed.tags).toEqual([ '0.15', 'latest' ]);
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
