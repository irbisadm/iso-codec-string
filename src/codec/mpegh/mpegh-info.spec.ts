import {MpeghInfo} from "./mpegh-info";

describe('MpeghInfo', () => {
  describe('parse / round-trip', () => {
    it.each([
      'mhm1.0c',
      'mhm2.12',
      'mha1.0b',
      'mha2.0d',
      'mhm1.10',
    ])('parses and round-trips %s', (str) => {
      expect(MpeghInfo.fromString(str).toString()).toBe(str);
    });

    it('decodes the fields', () => {
      const info = MpeghInfo.fromString('mhm1.0c');
      expect(info.fourCC).toBe('mhm1');
      expect(info.profileLevelId).toBe(0x0c);
    });

    it('normalizes hex to lowercase', () => {
      expect(MpeghInfo.fromString('mhm1.0C').toString()).toBe('mhm1.0c');
    });
  });

  describe('human-readable', () => {
    it.each([
      ['mhm1.0b', 'LC Profile Level 1'],
      ['mhm1.0c', 'LC Profile Level 2'],
      ['mhm1.0d', 'LC Profile Level 3'],
      ['mhm1.10', 'BL Profile Level 1'],
      ['mhm1.12', 'BL Profile Level 3'],
    ])('%s -> %s', (str, profileLevel) => {
      expect(MpeghInfo.fromString(str).toHumanReadable().profileLevel).toBe(profileLevel);
    });
  });

  describe('build', () => {
    it('assembles a codec string from parts', () => {
      const info = new MpeghInfo();
      info.fourCC = 'mhm1';
      info.profileLevelId = 0x0c;
      expect(info.toString()).toBe('mhm1.0c');
    });

    it('rejects an out-of-range profile-level id', () => {
      expect(() => { new MpeghInfo().profileLevelId = 256; }).toThrow('mpegh3daProfileLevelIndication');
    });
  });

  describe('invalid input', () => {
    it.each(['mhm1', 'mhm1.0c.1', 'mhm1.gg'])(
      'rejects malformed string %s',
      (str) => {
        expect(() => MpeghInfo.fromString(str)).toThrow('Invalid MPEG-H codec string');
      },
    );

    it('rejects an unknown 4CC', () => {
      expect(() => MpeghInfo.fromString('mhx1.0c')).toThrow('Unknown codec');
    });
  });
});
