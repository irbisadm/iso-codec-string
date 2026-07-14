import {Avs2AudioInfo} from "./avs2-audio-info";

describe('Avs2AudioInfo', () => {
  describe('parse / round-trip', () => {
    it.each(['cavs.00', 'cavs.01'])('parses and round-trips %s', (str) => {
      expect(Avs2AudioInfo.fromString(str).toString()).toBe(str);
    });

    it('decodes the audio codec id', () => {
      const info = Avs2AudioInfo.fromString('cavs.01');
      expect(info.fourCC).toBe('cavs');
      expect(info.audioCodecId).toBe(1);
    });
  });

  describe('human-readable', () => {
    it.each([
      ['cavs.00', 'General Audio Coding'],
      ['cavs.01', 'Lossless Audio Coding'],
    ])('%s -> %s', (str, codec) => {
      expect(Avs2AudioInfo.fromString(str).toHumanReadable().codec).toBe(codec);
    });
  });

  describe('build', () => {
    it('assembles a codec string from parts', () => {
      const info = new Avs2AudioInfo();
      info.audioCodecId = 1;
      expect(info.toString()).toBe('cavs.01');
    });

    it('rejects out-of-range bytes', () => {
      expect(() => { new Avs2AudioInfo().audioCodecId = 256; }).toThrow('audio_codec_id');
    });
  });

  describe('invalid input', () => {
    it.each(['cavs', 'cavs.00.01', 'cavs.GG'])(
      'rejects malformed string %s',
      (str) => {
        expect(() => Avs2AudioInfo.fromString(str)).toThrow('Invalid AVS2 audio codec string');
      },
    );

    it('rejects an unknown 4CC', () => {
      expect(() => Avs2AudioInfo.fromString('cav2.00')).toThrow('Unknown codec');
    });
  });
});
