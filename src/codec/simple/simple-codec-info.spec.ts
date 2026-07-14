import {SimpleCodecInfo} from "./simple-codec-info";

describe('SimpleCodecInfo', () => {
  describe('parse / round-trip', () => {
    it.each([
      'opus', 'flac', 'vorbis', 'alac',
      'dtsc', 'dtse', 'dtsh', 'dtsl', 'dtsx', 'dtsy',
      'vc-1',
      'twos', 'sowt', 'lpcm', 'ipcm', 'fpcm', 'in24', 'in32', 'fl32', 'fl64',
    ])('parses and round-trips %s', (str) => {
      expect(SimpleCodecInfo.fromString(str).toString()).toBe(str);
    });

    it('preserves the input casing but lowercases codecName', () => {
      const info = SimpleCodecInfo.fromString('fLaC');
      expect(info.fourCC).toBe('fLaC');
      expect(info.toString()).toBe('fLaC');
      expect(info.codecName).toBe('flac');
    });

    it('accepts a case-insensitive 4CC', () => {
      expect(SimpleCodecInfo.fromString('OPUS').codecName).toBe('opus');
    });
  });

  describe('human-readable', () => {
    it.each([
      ['opus', 'Opus'],
      ['flac', 'FLAC'],
      ['alac', 'Apple Lossless (ALAC)'],
      ['dtsc', 'DTS-HD Core'],
      ['dtsx', 'DTS:X (Profile 2)'],
      ['vc-1', 'SMPTE VC-1'],
      ['twos', 'PCM (big-endian)'],
      ['sowt', 'PCM (little-endian)'],
    ])('%s -> %s', (str, name) => {
      expect(SimpleCodecInfo.fromString(str).toHumanReadable().codec).toBe(name);
    });
  });

  describe('build', () => {
    it('sets a recognised 4CC', () => {
      const info = new SimpleCodecInfo();
      info.fourCC = 'opus';
      expect(info.toString()).toBe('opus');
      expect(info.toHumanReadable().codec).toBe('Opus');
    });
  });

  describe('invalid input', () => {
    it('rejects a codec with parameters', () => {
      expect(() => SimpleCodecInfo.fromString('opus.1')).toThrow('Unknown codec');
    });

    it('rejects an unrecognised 4CC', () => {
      expect(() => SimpleCodecInfo.fromString('theora')).toThrow('Unknown codec');
      expect(() => { new SimpleCodecInfo().fourCC = 'nope'; }).toThrow('Unknown codec');
    });
  });
});
