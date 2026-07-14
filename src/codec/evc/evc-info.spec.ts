import {EvcInfo} from "./evc-info";
import {EvcProfile} from "./enums";

const FULL = 'evc1.vprf1.vlev51.vtoh1fffff.vtol000000.vbit00.vcss420.vcpr01.vtrc01.vmac01.vfrf1.vsar01';

describe('EvcInfo', () => {
  describe('parse / round-trip', () => {
    it.each([
      'evc1.vprf0.vlev20',
      'evc1.vprf1.vlev51',
      'evc1.vprf3.vlev62',
      FULL,
    ])('parses and round-trips %s', (str) => {
      expect(EvcInfo.fromString(str).toString()).toBe(str);
    });

    it('decodes the mandatory fields and preserves the optional ones', () => {
      const info = EvcInfo.fromString(FULL);
      expect(info.fourCC).toBe('evc1');
      expect(info.profileIdc).toBe(EvcProfile.MAIN);
      expect(info.levelIdc).toBe(51);
      expect(info.optionalParams).toEqual([
        {key: 'vtoh', value: '1fffff'},
        {key: 'vtol', value: '000000'},
        {key: 'vbit', value: '00'},
        {key: 'vcss', value: '420'},
        {key: 'vcpr', value: '01'},
        {key: 'vtrc', value: '01'},
        {key: 'vmac', value: '01'},
        {key: 'vfrf', value: '1'},
        {key: 'vsar', value: '01'},
      ]);
    });

    it('lowercases parameter keys', () => {
      expect(EvcInfo.fromString('evc1.VPRF1.VLEV51').toString()).toBe('evc1.vprf1.vlev51');
    });
  });

  describe('human-readable', () => {
    it.each([
      ['evc1.vprf0.vlev20', 'Baseline'],
      ['evc1.vprf1.vlev51', 'Main'],
      ['evc1.vprf2.vlev20', 'Baseline Still Picture'],
      ['evc1.vprf3.vlev20', 'Main Still Picture'],
    ])('%s -> %s', (str, profile) => {
      expect(EvcInfo.fromString(str).toHumanReadable().profile).toBe(profile);
    });

    it.each([
      ['evc1.vprf1.vlev20', '2.0'],
      ['evc1.vprf1.vlev51', '5.1'],
      ['evc1.vprf1.vlev62', '6.2'],
    ])('%s -> level %s', (str, level) => {
      expect(EvcInfo.fromString(str).toHumanReadable().level).toBe(level);
    });

    it('reports every field', () => {
      expect(EvcInfo.fromString('evc1.vprf1.vlev51.vcpr09').toHumanReadable()).toEqual({
        fourCC: 'evc1',
        profile: 'Main',
        profileIdc: 1,
        level: '5.1',
        levelIdc: 51,
        optionalParams: 'vcpr09',
      });
    });
  });

  describe('build', () => {
    it('assembles a minimal codec string', () => {
      const info = new EvcInfo();
      info.profileIdc = EvcProfile.MAIN;
      info.levelIdc = 51;
      expect(info.toString()).toBe('evc1.vprf1.vlev51');
    });

    it('assembles a codec string with optional params', () => {
      const info = new EvcInfo();
      info.profileIdc = 1;
      info.levelIdc = 51;
      info.optionalParams = [{key: 'vbit', value: '00'}, {key: 'vcss', value: '420'}];
      expect(info.toString()).toBe('evc1.vprf1.vlev51.vbit00.vcss420');
    });

    it('rejects out-of-range fields and unknown optional keys', () => {
      expect(() => { new EvcInfo().profileIdc = 256; }).toThrow('vprf');
      expect(() => { new EvcInfo().levelIdc = -1; }).toThrow('vlev');
      expect(() => { new EvcInfo().optionalParams = [{key: 'vxxx', value: '1'}]; })
        .toThrow('Unknown EVC parameter');
    });
  });

  describe('invalid input', () => {
    it.each(['evc1', 'evc1.vprf1', 'evc1.vlev51'])(
      'rejects a string missing a mandatory parameter: %s',
      (str) => {
        expect(() => EvcInfo.fromString(str)).toThrow('Invalid EVC codec string');
      },
    );

    it('rejects an unknown parameter key', () => {
      expect(() => EvcInfo.fromString('evc1.vprf1.vlev51.vxxx1')).toThrow('Unknown EVC parameter');
    });

    it('rejects a non-hex toolset value', () => {
      expect(() => EvcInfo.fromString('evc1.vprf1.vlev51.vtohZZ')).toThrow('Invalid EVC parameter value');
    });

    it('rejects an unknown 4CC', () => {
      expect(() => EvcInfo.fromString('evc9.vprf1.vlev51')).toThrow('Unknown codec');
    });
  });
});
