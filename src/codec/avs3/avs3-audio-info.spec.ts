import {Avs3AudioInfo} from "./avs3-audio-info";

describe('Avs3AudioInfo', () => {
  describe('parse / round-trip', () => {
    it.each(['av3a.00', 'av3a.01', 'av3a.02'])('parses and round-trips %s', (str) => {
      expect(Avs3AudioInfo.fromString(str).toString()).toBe(str);
    });

    it('decodes the audio codec id', () => {
      const info = Avs3AudioInfo.fromString('av3a.01');
      expect(info.fourCC).toBe('av3a');
      expect(info.audioCodecId).toBe(1);
    });
  });

  describe('human-readable', () => {
    it.each([
      ['av3a.00', 'General Audio Coding'],
      ['av3a.01', 'Lossless Audio Coding'],
      ['av3a.02', 'Full Rate Audio Coding'],
    ])('%s -> %s', (str, codec) => {
      expect(Avs3AudioInfo.fromString(str).toHumanReadable().codec).toBe(codec);
    });
  });

  describe('build', () => {
    it('assembles a codec string from parts', () => {
      const info = new Avs3AudioInfo();
      info.audioCodecId = 2;
      expect(info.toString()).toBe('av3a.02');
    });

    it('rejects out-of-range bytes', () => {
      expect(() => { new Avs3AudioInfo().audioCodecId = 256; }).toThrow('audio_codec_id');
    });
  });

  describe('invalid input', () => {
    it.each(['av3a', 'av3a.00.01', 'av3a.GG'])(
      'rejects malformed string %s',
      (str) => {
        expect(() => Avs3AudioInfo.fromString(str)).toThrow('Invalid AVS3 audio codec string');
      },
    );

    it('rejects an unknown 4CC', () => {
      expect(() => Avs3AudioInfo.fromString('av4a.00')).toThrow('Unknown codec');
    });
  });
});
