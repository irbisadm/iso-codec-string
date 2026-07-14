import {StppInfo} from "./stpp-info";

describe('StppInfo', () => {
  describe('parse / round-trip', () => {
    it.each([
      'stpp',
      'stpp.ttml',
      'stpp.ttml.im1t',
      'stpp.ttml.etx1',
      'stpp.ttml.tt2f',
      'stpp.ttml.abcd',
    ])('parses and round-trips %s', (str) => {
      expect(StppInfo.fromString(str).toString()).toBe(str);
    });

    it('decodes the mode and profile', () => {
      const info = StppInfo.fromString('stpp.ttml.im1t');
      expect(info.mode).toBe('ttml');
      expect(info.profile).toBe('im1t');
    });

    it('parses the bare and mode-only forms', () => {
      expect(StppInfo.fromString('stpp').mode).toBeUndefined();
      const modeOnly = StppInfo.fromString('stpp.ttml');
      expect(modeOnly.mode).toBe('ttml');
      expect(modeOnly.profile).toBeUndefined();
    });
  });

  describe('human-readable', () => {
    it.each([
      ['stpp.ttml.im1t', 'IMSC1 text'],
      ['stpp.ttml.im1i', 'IMSC1 image'],
      ['stpp.ttml.tt2f', 'TTML2 full'],
      ['stpp.ttml.etx1', 'EBU Subtitling Format v1.0'],
      ['stpp.ttml.abcd', 'unknown'],
    ])('%s -> %s', (str, description) => {
      expect(StppInfo.fromString(str).toHumanReadable().description).toBe(description);
    });

    it('reports the bare form', () => {
      expect(StppInfo.fromString('stpp').toHumanReadable()).toEqual({
        fourCC: 'stpp',
        mode: 'none',
        profile: 'none',
        description: 'none',
      });
    });
  });

  describe('build', () => {
    it('assembles a codec string from parts', () => {
      const info = new StppInfo();
      info.mode = 'ttml';
      info.profile = 'im1t';
      expect(info.toString()).toBe('stpp.ttml.im1t');
    });

    it('requires a mode before a profile', () => {
      expect(() => { new StppInfo().profile = 'im1t'; }).toThrow('requires a mode');
    });
  });

  describe('invalid input', () => {
    it('rejects an empty mode', () => {
      expect(() => StppInfo.fromString('stpp..im1t')).toThrow('Invalid stpp mode');
    });

    it('rejects an unknown 4CC', () => {
      expect(() => StppInfo.fromString('sbtt.ttml')).toThrow('Unknown codec');
    });
  });
});
