import {H265Info} from "./hevc-info";
import {HevcProfileIdc} from "./enums";

describe('H265Info', () => {
  describe('parse / round-trip', () => {
    it.each([
      'hvc1.1.6.L93.B0',
      'hev1.1.6.L150.90',
      'hvc1.2.4.L153.B0',
      'hvc1.A4.4.H120',
      'hev1.1.6.L150.90.90',
      'hvc1.3.E.L120.90',
    ])('parses and round-trips %s', (str) => {
      expect(H265Info.fromString(str).toString()).toBe(str);
    });

    it('decodes every field of hvc1.2.4.L153.B0', () => {
      const info = H265Info.fromString('hvc1.2.4.L153.B0');
      expect(info.fourCC).toBe('hvc1');
      expect(info.profileSpace).toBe(0);
      expect(info.profileIdc).toBe(HevcProfileIdc.MAIN_10);
      expect(info.compatibilityFlags).toBe(0x4);
      expect(info.tierFlag).toBe(0);
      expect(info.levelIdc).toBe(153);
      expect(info.constraintFlags).toEqual([0xB0]);
    });

    it('parses the profile-space letter prefix', () => {
      expect(H265Info.fromString('hvc1.A1.6.L93').profileSpace).toBe(1);
      expect(H265Info.fromString('hvc1.B1.6.L93').profileSpace).toBe(2);
      expect(H265Info.fromString('hvc1.C1.6.L93').profileSpace).toBe(3);
    });

    it('trims trailing zero constraint bytes', () => {
      expect(H265Info.fromString('hvc1.1.6.L93.B0.00.00').toString()).toBe('hvc1.1.6.L93.B0');
    });

    it('parses the high tier', () => {
      const info = H265Info.fromString('hvc1.1.6.H120');
      expect(info.tierFlag).toBe(1);
      expect(info.toString()).toBe('hvc1.1.6.H120');
    });
  });

  describe('profile decoding', () => {
    it.each([
      ['hvc1.1.6.L93', 'Main'],
      ['hvc1.2.4.L93', 'Main 10'],
      ['hvc1.3.0.L93', 'Main Still Picture'],
      ['hvc1.4.0.L93', 'Range Extensions'],
    ])('%s -> %s', (str, profile) => {
      expect(H265Info.fromString(str).toHumanReadable().profile).toBe(profile);
    });
  });

  describe('level decoding', () => {
    it.each([
      ['hvc1.1.6.L30', '1.0'],
      ['hvc1.1.6.L63', '2.1'],
      ['hvc1.1.6.L93', '3.1'],
      ['hvc1.1.6.L120', '4.0'],
      ['hvc1.1.6.L153', '5.1'],
      ['hvc1.1.6.L156', '5.2'],
      ['hvc1.1.6.L186', '6.2'],
    ])('%s -> level %s', (str, level) => {
      expect(H265Info.fromString(str).toHumanReadable().level).toBe(level);
    });

    it('reports the tier name', () => {
      expect(H265Info.fromString('hvc1.1.6.L93').toHumanReadable().tier).toBe('main');
      expect(H265Info.fromString('hvc1.1.6.H93').toHumanReadable().tier).toBe('high');
    });
  });

  describe('build', () => {
    it('assembles a codec string from parts', () => {
      const info = new H265Info();
      info.fourCC = 'hvc1';
      info.profileIdc = HevcProfileIdc.MAIN;
      info.compatibilityFlags = 0x6;
      info.levelIdc = 93;
      info.constraintFlags = [0xB0];
      expect(info.toString()).toBe('hvc1.1.6.L93.B0');
    });

    it('emits the profile-space letter and high tier', () => {
      const info = new H265Info();
      info.profileSpace = 1;
      info.profileIdc = 4;
      info.compatibilityFlags = 0x4;
      info.tierFlag = 1;
      info.levelIdc = 120;
      expect(info.toString()).toBe('hvc1.A4.4.H120');
    });

    it('rejects out-of-range fields', () => {
      expect(() => { new H265Info().profileSpace = 4; }).toThrow('general_profile_space');
      expect(() => { new H265Info().profileIdc = 32; }).toThrow('general_profile_idc');
      expect(() => { new H265Info().levelIdc = 256; }).toThrow('general_level_idc');
      expect(() => { new H265Info().tierFlag = 2; }).toThrow('general_tier_flag');
      expect(() => { new H265Info().constraintFlags = [1, 2, 3, 4, 5, 6, 7]; })
        .toThrow('at most 6 bytes');
    });
  });

  describe('invalid input', () => {
    it.each(['hvc1', 'hvc1.1.6', 'hvc1.1.GG.L93', 'hvc1.1.6.X93', 'hvc1.1.6.L93.01.02.03.04.05.06.07'])(
      'rejects malformed string %s',
      (str) => {
        expect(() => H265Info.fromString(str)).toThrow(/Invalid HEVC|Unknown codec/);
      },
    );

    it('rejects an unknown 4CC', () => {
      expect(() => H265Info.fromString('hvc9.1.6.L93')).toThrow('Unknown codec');
    });
  });

  describe('toHumanReadable', () => {
    it('reports every field', () => {
      expect(H265Info.fromString('hvc1.2.4.L153.B0').toHumanReadable()).toEqual({
        fourCC: 'hvc1',
        profileSpace: 0,
        profile: 'Main 10',
        profileIdc: 2,
        compatibilityFlags: '4',
        tier: 'main',
        level: '5.1',
        levelIdc: 153,
        constraintFlags: 'B0',
      });
    });
  });
});
