import {LhevcInfo} from "./lhevc-info";

describe('LhevcInfo', () => {
  describe('parse / round-trip', () => {
    it.each([
      'lhv1.2.4.L120.B0',
      'lhe1.1.6.L93.B0',
      'lhv1.A4.4.H120',
      'lhv1.2.4.L120.B0.SC01',
    ])('parses and round-trips %s', (str) => {
      expect(LhevcInfo.fromString(str).toString()).toBe(str);
    });

    it('decodes the HEVC profile-tier-level and preserves the scalability field', () => {
      const info = LhevcInfo.fromString('lhv1.2.4.L120.B0.SC01');
      expect(info.fourCC).toBe('lhv1');
      expect(info.ptl.profileIdc).toBe(2);
      expect(info.ptl.tierFlag).toBe(0);
      expect(info.ptl.levelIdc).toBe(120);
      expect(info.ptl.constraintFlags).toEqual([0xB0]);
      expect(info.scalability).toEqual(['SC01']);
    });

    it('handles the in-band lhe1 sample entry', () => {
      expect(LhevcInfo.fromString('lhe1.1.6.L93.B0').fourCC).toBe('lhe1');
    });
  });

  describe('human-readable', () => {
    it('reports the PTL fields and scalability', () => {
      expect(LhevcInfo.fromString('lhv1.2.4.L120.B0').toHumanReadable()).toEqual({
        fourCC: 'lhv1',
        profile: 'Main 10',
        profileIdc: 2,
        tier: 'main',
        level: '4.0',
        levelIdc: 120,
        scalability: 'none',
      });
    });
  });

  describe('build', () => {
    it('assembles a codec string via the reused HEVC PTL', () => {
      const info = new LhevcInfo();
      info.fourCC = 'lhv1';
      info.ptl.profileIdc = 2;
      info.ptl.compatibilityFlags = 0x4;
      info.ptl.levelIdc = 120;
      info.ptl.constraintFlags = [0xB0];
      expect(info.toString()).toBe('lhv1.2.4.L120.B0');
    });

    it('appends a scalability field', () => {
      const info = new LhevcInfo();
      info.ptl.profileIdc = 1;
      info.ptl.compatibilityFlags = 0x6;
      info.ptl.levelIdc = 93;
      info.ptl.constraintFlags = [0xB0];
      info.scalability = ['SC01'];
      expect(info.toString()).toBe('lhv1.1.6.L93.B0.SC01');
    });

    it('rejects a scalability field that does not start with S', () => {
      expect(() => { new LhevcInfo().scalability = ['C01']; })
        .toThrow('must start with "S"');
    });
  });

  describe('invalid input', () => {
    it.each(['lhv1', 'lhv1.2'])(
      'rejects a string without a full profile-tier-level: %s',
      (str) => {
        expect(() => LhevcInfo.fromString(str)).toThrow('Invalid L-HEVC codec string');
      },
    );

    it('propagates an invalid profile-tier-level error', () => {
      expect(() => LhevcInfo.fromString('lhv1.2.4.X120')).toThrow(/Invalid HEVC/);
    });

    it('rejects an unknown 4CC', () => {
      expect(() => LhevcInfo.fromString('lhv9.2.4.L120')).toThrow('Unknown codec');
    });
  });
});
