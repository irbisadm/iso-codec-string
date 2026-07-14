import {UncvInfo} from "./uncv-info";

describe('UncvInfo', () => {
  describe('parse / round-trip', () => {
    it.each([
      'uncv',
      'uncv.rgba',
      'uncv.i420',
      'uncv.2vuy',
      'uncv.v210',
      'unci.rgb3',
      'uncv.abcd',
    ])('parses and round-trips %s', (str) => {
      expect(UncvInfo.fromString(str).toString()).toBe(str);
    });

    it('decodes the fields', () => {
      const info = UncvInfo.fromString('uncv.rgba');
      expect(info.fourCC).toBe('uncv');
      expect(info.profile).toBe('rgba');
    });

    it('parses the bare generic form', () => {
      const info = UncvInfo.fromString('uncv');
      expect(info.profile).toBeUndefined();
    });

    it('sets codecName from the sample entry', () => {
      expect(UncvInfo.fromString('unci.rgb3').codecName).toBe('unci');
    });
  });

  describe('human-readable', () => {
    it.each([
      ['uncv.rgba', 'rgba', 'RGBA 32-bit packed'],
      ['uncv.i420', 'i420', 'YUV 4:2:0 8-bit planar'],
      ['uncv.v210', 'v210', '10-bit YUV 4:2:2'],
      ['uncv.abcd', 'abcd', 'unknown'],
    ])('%s -> %s / %s', (str, profile, format) => {
      const hr = UncvInfo.fromString(str).toHumanReadable();
      expect(hr.profile).toBe(profile);
      expect(hr.format).toBe(format);
    });

    it('reports the generic form', () => {
      expect(UncvInfo.fromString('uncv').toHumanReadable()).toEqual({
        fourCC: 'uncv',
        profile: 'none',
        format: 'generic',
      });
    });
  });

  describe('build', () => {
    it('assembles a profiled codec string', () => {
      const info = new UncvInfo();
      info.fourCC = 'uncv';
      info.profile = 'rgba';
      expect(info.toString()).toBe('uncv.rgba');
    });

    it('assembles the generic form', () => {
      expect(new UncvInfo().toString()).toBe('uncv');
    });

    it('rejects a profile that is not four characters', () => {
      expect(() => { new UncvInfo().profile = 'rgb'; }).toThrow('four-character code');
    });
  });

  describe('invalid input', () => {
    it.each(['uncv.rgba.x', 'uncv.rgb'])(
      'rejects malformed string %s',
      (str) => {
        expect(() => UncvInfo.fromString(str)).toThrow('Invalid uncv');
      },
    );

    it('rejects an unknown 4CC', () => {
      expect(() => UncvInfo.fromString('uncx.rgba')).toThrow('Unknown codec');
    });
  });
});
