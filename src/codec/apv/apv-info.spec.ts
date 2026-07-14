import {ApvInfo} from "./apv-info";

describe('ApvInfo', () => {
  describe('parse / round-trip', () => {
    it.each([
      'apv1.apvf44.apvl210.apvb3',
      'apv1.apvf33.apvl90.apvb0',
      'apv1.apvf44.apvl60.apvb2',
    ])('parses and round-trips %s', (str) => {
      expect(ApvInfo.fromString(str).toString()).toBe(str);
    });

    it('decodes the fields', () => {
      const info = ApvInfo.fromString('apv1.apvf44.apvl210.apvb3');
      expect(info.fourCC).toBe('apv1');
      expect(info.profileIdc).toBe(44);
      expect(info.levelIdc).toBe(210);
      expect(info.bandIdc).toBe(3);
    });

    it('accepts case-insensitive keys and tolerates order', () => {
      expect(ApvInfo.fromString('apv1.APVB3.apvl210.APVF44').toString())
        .toBe('apv1.apvf44.apvl210.apvb3');
    });
  });

  describe('human-readable', () => {
    it('names the confirmed profile and derives the level', () => {
      const hr = ApvInfo.fromString('apv1.apvf44.apvl210.apvb3').toHumanReadable();
      expect(hr).toEqual({
        fourCC: 'apv1',
        profile: '422-12',
        profileIdc: 44,
        level: '7',
        levelIdc: 210,
        band: 3,
      });
    });

    it('reports an unmapped profile as unknown while keeping the numeric idc', () => {
      const hr = ApvInfo.fromString('apv1.apvf99.apvl90.apvb1').toHumanReadable();
      expect(hr.profile).toBe('unknown');
      expect(hr.profileIdc).toBe(99);
      expect(hr.level).toBe('3');
    });
  });

  describe('build', () => {
    it('assembles a codec string from parts', () => {
      const info = new ApvInfo();
      info.profileIdc = 44;
      info.levelIdc = 210;
      info.bandIdc = 3;
      expect(info.toString()).toBe('apv1.apvf44.apvl210.apvb3');
    });

    it('rejects out-of-range fields', () => {
      expect(() => { new ApvInfo().profileIdc = 256; }).toThrow('apvf');
      expect(() => { new ApvInfo().levelIdc = -1; }).toThrow('apvl');
      expect(() => { new ApvInfo().bandIdc = 300; }).toThrow('apvb');
    });
  });

  describe('invalid input', () => {
    it.each(['apv1', 'apv1.apvf44', 'apv1.apvf44.apvl210'])(
      'rejects a string missing a parameter: %s',
      (str) => {
        expect(() => ApvInfo.fromString(str)).toThrow('Invalid APV codec string');
      },
    );

    it('rejects an unknown parameter key', () => {
      expect(() => ApvInfo.fromString('apv1.apvf44.apvl210.apvb3.apvx1'))
        .toThrow('Unknown APV parameter');
    });

    it('rejects a non-numeric value', () => {
      expect(() => ApvInfo.fromString('apv1.apvfXX.apvl210.apvb3'))
        .toThrow('Invalid APV parameter value');
    });

    it('rejects an unknown 4CC', () => {
      expect(() => ApvInfo.fromString('apv9.apvf44.apvl210.apvb3')).toThrow('Unknown codec');
    });
  });
});
