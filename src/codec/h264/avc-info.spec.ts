import {H264Info} from "./avc-info";
import {AvcProfileIdc} from "./enums";

describe('H264Info', () => {
  describe('parse / round-trip', () => {
    it.each([
      // string,            profileIdc,                    constraintFlags, levelIdc
      ['avc1.640028', AvcProfileIdc.HIGH, 0x00, 0x28],
      ['avc1.4D401E', AvcProfileIdc.MAIN, 0x40, 0x1E],
      ['avc1.42E01E', AvcProfileIdc.BASELINE, 0xE0, 0x1E],
      ['avc1.640033', AvcProfileIdc.HIGH, 0x00, 0x33],
      ['avc3.42C01F', AvcProfileIdc.BASELINE, 0xC0, 0x1F],
    ])('parses %s and round-trips', (str, profileIdc, constraintFlags, levelIdc) => {
      const info = H264Info.fromString(str as string);
      expect(info.profileIdc).toBe(profileIdc);
      expect(info.constraintFlags).toBe(constraintFlags);
      expect(info.levelIdc).toBe(levelIdc);
      expect(info.toString()).toBe(str);
    });

    it('preserves the sample-entry 4CC', () => {
      expect(H264Info.fromString('avc3.640028').fourCC).toBe('avc3');
      expect(H264Info.fromString('avc3.640028').toString()).toBe('avc3.640028');
    });

    it('normalizes lowercase hex to uppercase', () => {
      expect(H264Info.fromString('avc1.64001f').toString()).toBe('avc1.64001F');
    });
  });

  describe('profile decoding', () => {
    it.each([
      ['avc1.42E01E', 'Constrained Baseline'], // profile 66 + constraint_set1
      ['avc1.42001E', 'Baseline'],
      ['avc1.4D401E', 'Main'],
      ['avc1.640028', 'High'],
      ['avc1.640828', 'Progressive High'], // profile 100 + constraint_set4
      ['avc1.640C28', 'Constrained High'], // profile 100 + constraint_set4 + constraint_set5
      ['avc1.6E0028', 'High 10'],
      ['avc1.6E1028', 'High 10 Intra'], // + constraint_set3
      ['avc1.7A0028', 'High 4:2:2'],
      ['avc1.F40028', 'High 4:4:4 Predictive'],
      ['avc1.2C1028', 'CAVLC 4:4:4 Intra'],
    ])('%s -> %s', (str, profile) => {
      expect(H264Info.fromString(str as string).toHumanReadable().profile).toBe(profile);
    });
  });

  describe('level decoding', () => {
    it.each([
      ['avc1.42001E', '3.0'],
      ['avc1.640029', '4.1'],
      ['avc1.640033', '5.1'],
      ['avc1.64003E', '6.2'],
      ['avc1.42100B', '1b'], // Baseline, level_idc 11 + constraint_set3 -> 1b
      ['avc1.42000B', '1.1'], // same level_idc without constraint_set3 -> 1.1
      ['avc1.640009', '1b'], // High profile, level_idc 9 -> 1b
    ])('%s -> level %s', (str, level) => {
      expect(H264Info.fromString(str as string).toHumanReadable().level).toBe(level);
    });
  });

  describe('build', () => {
    it('assembles a codec string from parts', () => {
      const info = new H264Info();
      info.profileIdc = AvcProfileIdc.BASELINE;
      info.levelIdc = 0x1E;
      info.constraintSet1 = true;
      expect(info.toString()).toBe('avc1.42401E');
      expect(info.toHumanReadable().profile).toBe('Constrained Baseline');
    });

    it('toggles constraint-set flags', () => {
      const info = new H264Info();
      info.constraintSet0 = true;
      info.constraintSet3 = true;
      expect(info.constraintFlags).toBe(0x90); // bit7 | bit4
      info.constraintSet0 = false;
      expect(info.constraintFlags).toBe(0x10);
    });

    it('serializes empty defaults', () => {
      expect(new H264Info().toString()).toBe('avc1.000000');
    });

    it('rejects out-of-range bytes', () => {
      expect(() => { new H264Info().profileIdc = 256; }).toThrow('profile_idc must be a byte');
      expect(() => { new H264Info().levelIdc = -1; }).toThrow('level_idc must be a byte');
    });
  });

  describe('invalid input', () => {
    it.each(['avc1', 'avc1.6400', 'avc1.64002G', 'avc1.6400280'])(
      'rejects malformed string %s',
      (str) => {
        expect(() => H264Info.fromString(str)).toThrow('Invalid AVC codec string');
      },
    );

    it('rejects an unknown 4CC', () => {
      expect(() => H264Info.fromString('avc9.640028')).toThrow('Unknown codec');
    });
  });

  describe('toHumanReadable', () => {
    it('reports every field', () => {
      expect(H264Info.fromString('avc1.640028').toHumanReadable()).toEqual({
        fourCC: 'avc1',
        profile: 'High',
        profileIdc: 100,
        level: '4.0',
        levelIdc: 40,
        constraintSet0: false,
        constraintSet1: false,
        constraintSet2: false,
        constraintSet3: false,
        constraintSet4: false,
        constraintSet5: false,
      });
    });
  });
});
