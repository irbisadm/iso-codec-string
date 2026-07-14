import {H266Info} from "./vvc-info";
import {VvcProfileIdc} from "./enums";

describe('H266Info', () => {
  describe('parse / round-trip', () => {
    it.each([
      'vvi1.1.L83',
      'vvc1.1.L51',
      'vvi1.1.H96',
      'vvi1.1.L83.CQA',
      'vvi1.1.L83.CQA.O0',
      'vvc1.65.L64',
    ])('parses and round-trips %s', (str) => {
      expect(H266Info.fromString(str).toString()).toBe(str);
    });

    it('decodes every field of vvi1.1.L83.CQA', () => {
      const info = H266Info.fromString('vvi1.1.L83.CQA');
      expect(info.fourCC).toBe('vvi1');
      expect(info.profileIdc).toBe(VvcProfileIdc.MAIN_10);
      expect(info.tierFlag).toBe(0);
      expect(info.levelIdc).toBe(83);
      expect(info.optionalParams).toEqual(['CQA']);
    });

    it('preserves the high tier and fourCC', () => {
      const info = H266Info.fromString('vvc1.1.H96');
      expect(info.tierFlag).toBe(1);
      expect(info.fourCC).toBe('vvc1');
      expect(info.toString()).toBe('vvc1.1.H96');
    });
  });

  describe('profile decoding', () => {
    it.each([
      ['vvi1.1.L83', 'Main 10'],
      ['vvi1.17.L83', 'Multilayer Main 10'],
      ['vvi1.33.L83', 'Main 10 4:4:4'],
      ['vvi1.65.L83', 'Main 10 Still Picture'],
    ])('%s -> %s', (str, profile) => {
      expect(H266Info.fromString(str).toHumanReadable().profile).toBe(profile);
    });
  });

  describe('level decoding', () => {
    it.each([
      ['vvi1.1.L16', '1.0'],
      ['vvi1.1.L35', '2.1'],
      ['vvi1.1.L51', '3.1'],
      ['vvi1.1.L64', '4.0'],
      ['vvi1.1.L83', '5.1'],
      ['vvi1.1.L86', '5.2'],
      ['vvi1.1.L102', '6.2'],
    ])('%s -> level %s', (str, level) => {
      expect(H266Info.fromString(str).toHumanReadable().level).toBe(level);
    });

    it('reports the tier name', () => {
      expect(H266Info.fromString('vvi1.1.L83').toHumanReadable().tier).toBe('main');
      expect(H266Info.fromString('vvi1.1.H83').toHumanReadable().tier).toBe('high');
    });
  });

  describe('build', () => {
    it('assembles a codec string from parts', () => {
      const info = new H266Info();
      info.fourCC = 'vvi1';
      info.profileIdc = VvcProfileIdc.MAIN_10;
      info.levelIdc = 83;
      expect(info.toString()).toBe('vvi1.1.L83');
    });

    it('emits the high tier and optional fields', () => {
      const info = new H266Info();
      info.fourCC = 'vvc1';
      info.profileIdc = 1;
      info.tierFlag = 1;
      info.levelIdc = 96;
      info.optionalParams = ['CQA', 'O0'];
      expect(info.toString()).toBe('vvc1.1.H96.CQA.O0');
    });

    it('rejects out-of-range fields', () => {
      expect(() => { new H266Info().profileIdc = 128; }).toThrow('general_profile_idc');
      expect(() => { new H266Info().levelIdc = 256; }).toThrow('general_level_idc');
      expect(() => { new H266Info().tierFlag = 2; }).toThrow('general_tier_flag');
      expect(() => { new H266Info().optionalParams = ['CQA', '']; })
        .toThrow('must not be empty');
    });
  });

  describe('invalid input', () => {
    it.each(['vvi1', 'vvi1.1', 'vvi1.X.L83', 'vvi1.1.X83', 'vvi1.1.L83.'])(
      'rejects malformed string %s',
      (str) => {
        expect(() => H266Info.fromString(str)).toThrow(/Invalid VVC|must not be empty/);
      },
    );

    it('rejects an unknown 4CC', () => {
      expect(() => H266Info.fromString('vvc9.1.L83')).toThrow('Unknown codec');
    });
  });

  describe('toHumanReadable', () => {
    it('reports every field', () => {
      expect(H266Info.fromString('vvi1.1.L83.CQA').toHumanReadable()).toEqual({
        fourCC: 'vvi1',
        profile: 'Main 10',
        profileIdc: 1,
        tier: 'main',
        level: '5.1',
        levelIdc: 83,
        optionalParams: 'CQA',
      });
    });
  });
});
