import {Avs3VideoInfo} from "./avs3-video-info";

describe('Avs3VideoInfo', () => {
  describe('parse / round-trip', () => {
    it.each([
      'avs3.20.10',
      'avs3.32.50',
      'avs3.22.20',
      'avs3.ab.cd',
      'lav3.20.10',
    ])('parses and round-trips %s', (str) => {
      expect(Avs3VideoInfo.fromString(str).toString()).toBe(str);
    });

    it('accepts the lav3 library-track sample entry', () => {
      const info = Avs3VideoInfo.fromString('lav3.20.10');
      expect(info.fourCC).toBe('lav3');
      expect(info.codecName).toBe('lav3');
    });

    it('decodes the fields', () => {
      const info = Avs3VideoInfo.fromString('avs3.20.10');
      expect(info.fourCC).toBe('avs3');
      expect(info.profileId).toBe(0x20);
      expect(info.levelId).toBe(0x10);
    });

    it('normalizes hex to lowercase', () => {
      expect(Avs3VideoInfo.fromString('avs3.AB.CD').toString()).toBe('avs3.ab.cd');
    });
  });

  describe('human-readable', () => {
    it.each([
      ['avs3.20.10', 'Main 8-bit', '2.0.15'],
      ['avs3.22.20', 'Main 10-bit', '4.0.30'],
      ['avs3.30.50', 'High 8-bit', '8.0.30'],
      ['avs3.32.50', 'High 10-bit', '8.0.30'],
    ])('%s -> %s / level %s', (str, profile, level) => {
      const hr = Avs3VideoInfo.fromString(str).toHumanReadable();
      expect(hr.profile).toBe(profile);
      expect(hr.level).toBe(level);
    });
  });

  describe('build', () => {
    it('assembles a codec string from parts', () => {
      const info = new Avs3VideoInfo();
      info.profileId = 0x20;
      info.levelId = 0x10;
      expect(info.toString()).toBe('avs3.20.10');
    });

    it('rejects out-of-range bytes', () => {
      expect(() => { new Avs3VideoInfo().profileId = 256; }).toThrow('profile_id');
      expect(() => { new Avs3VideoInfo().levelId = -1; }).toThrow('level_id');
    });
  });

  describe('invalid input', () => {
    it.each(['avs3', 'avs3.20', 'avs3.20.10.5', 'avs3.GG.10'])(
      'rejects malformed string %s',
      (str) => {
        expect(() => Avs3VideoInfo.fromString(str)).toThrow('Invalid AVS3 video codec string');
      },
    );

    it('rejects an unknown 4CC', () => {
      expect(() => Avs3VideoInfo.fromString('avs2.20.10')).toThrow('Unknown codec');
    });
  });
});
