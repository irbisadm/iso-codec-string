import {LcevcInfo} from "./lcevc-info";
import {LcevcProfile} from "./enums";

describe('LcevcInfo', () => {
  describe('parse / round-trip', () => {
    it.each([
      'lvc1.vprf0.vlev4',
      'lvc1.vprf1.vlev2',
      'lvc1.vprf0.vlev1',
    ])('parses and round-trips %s', (str) => {
      expect(LcevcInfo.fromString(str).toString()).toBe(str);
    });

    it('decodes the fields', () => {
      const info = LcevcInfo.fromString('lvc1.vprf1.vlev3');
      expect(info.fourCC).toBe('lvc1');
      expect(info.profileIdc).toBe(LcevcProfile.MAIN_4_4_4);
      expect(info.levelIdc).toBe(3);
    });

    it('accepts case-insensitive keys and normalizes them', () => {
      expect(LcevcInfo.fromString('lvc1.VPRF0.VLEV4').toString()).toBe('lvc1.vprf0.vlev4');
    });

    it('tolerates key order', () => {
      expect(LcevcInfo.fromString('lvc1.vlev2.vprf1').toString()).toBe('lvc1.vprf1.vlev2');
    });
  });

  describe('human-readable', () => {
    it.each([
      ['lvc1.vprf0.vlev4', 'Main'],
      ['lvc1.vprf1.vlev4', 'Main 4:4:4'],
    ])('%s -> %s', (str, profile) => {
      expect(LcevcInfo.fromString(str).toHumanReadable().profile).toBe(profile);
    });

    it('reports every field', () => {
      expect(LcevcInfo.fromString('lvc1.vprf1.vlev3').toHumanReadable()).toEqual({
        fourCC: 'lvc1',
        profile: 'Main 4:4:4',
        profileIdc: 1,
        level: '3',
        levelIdc: 3,
      });
    });
  });

  describe('build', () => {
    it('assembles a codec string from parts', () => {
      const info = new LcevcInfo();
      info.profileIdc = LcevcProfile.MAIN;
      info.levelIdc = 4;
      expect(info.toString()).toBe('lvc1.vprf0.vlev4');
    });

    it('rejects out-of-range fields', () => {
      expect(() => { new LcevcInfo().profileIdc = 256; }).toThrow('vprf');
      expect(() => { new LcevcInfo().levelIdc = -1; }).toThrow('vlev');
    });
  });

  describe('invalid input', () => {
    it.each(['lvc1', 'lvc1.vprf0', 'lvc1.vlev4'])(
      'rejects a string missing a parameter: %s',
      (str) => {
        expect(() => LcevcInfo.fromString(str)).toThrow('Invalid LCEVC codec string');
      },
    );

    it('rejects an unknown parameter key', () => {
      expect(() => LcevcInfo.fromString('lvc1.vprf0.vlev4.vxxx1')).toThrow('Unknown LCEVC parameter');
    });

    it('rejects a non-numeric value', () => {
      expect(() => LcevcInfo.fromString('lvc1.vprfA.vlev4')).toThrow('Invalid LCEVC parameter value');
    });

    it('rejects an unknown 4CC', () => {
      expect(() => LcevcInfo.fromString('lvc9.vprf0.vlev4')).toThrow('Unknown codec');
    });
  });
});
