import {Mp4Info} from "./mp4-info";

describe('Mp4Info', () => {
  describe('parse / round-trip', () => {
    it.each([
      'mp4a.40.2',   // AAC-LC
      'mp4a.40.5',   // HE-AAC
      'mp4a.40.29',  // HE-AAC v2
      'mp4a.69',     // MP3 (MPEG-2)
      'mp4a.6B',     // MP3 (MPEG-1)
      'mp4a.A9',     // DTS
      'mp4v.20.9',   // MPEG-4 Visual Simple Profile
      'mp4v.61',     // MPEG-2 Video Main Profile
    ])('parses and round-trips %s', (str) => {
      expect(Mp4Info.fromString(str).toString()).toBe(str);
    });

    it('decodes the fields', () => {
      const info = Mp4Info.fromString('mp4a.40.2');
      expect(info.fourCC).toBe('mp4a');
      expect(info.codecName).toBe('mp4a');
      expect(info.objectTypeIndication).toBe(0x40);
      expect(info.objectType).toBe(2);
    });

    it('leaves the third element undefined when absent', () => {
      const info = Mp4Info.fromString('mp4a.6B');
      expect(info.objectTypeIndication).toBe(0x6b);
      expect(info.objectType).toBeUndefined();
    });

    it('sets codecName from the sample entry', () => {
      expect(Mp4Info.fromString('mp4v.20.9').codecName).toBe('mp4v');
    });

    it('normalizes the OTI to two uppercase hex digits', () => {
      expect(Mp4Info.fromString('mp4a.6b').toString()).toBe('mp4a.6B');
    });
  });

  describe('human-readable', () => {
    it.each([
      ['mp4a.40.2', 'MPEG-4 Audio (AAC)', 'AAC-LC'],
      ['mp4a.40.5', 'MPEG-4 Audio (AAC)', 'SBR (HE-AAC)'],
      ['mp4a.40.34', 'MPEG-4 Audio (AAC)', 'MP3 (MPEG-1 Layer III)'],
      ['mp4a.69', 'MPEG-2 Audio Part 3 (MP3)', 'none'],
      ['mp4v.20.9', 'MPEG-4 Visual', '9'],
      ['mp4v.61', 'MPEG-2 Video Main Profile', 'none'],
    ])('%s -> %s / %s', (str, codec, detail) => {
      const hr = Mp4Info.fromString(str).toHumanReadable();
      expect(hr.codec).toBe(codec);
      expect(hr.detail).toBe(detail);
    });

    it('reports every field', () => {
      expect(Mp4Info.fromString('mp4a.40.2').toHumanReadable()).toEqual({
        fourCC: 'mp4a',
        codec: 'MPEG-4 Audio (AAC)',
        objectTypeIndication: 0x40,
        detail: 'AAC-LC',
      });
    });
  });

  describe('build', () => {
    it('assembles a three-element codec string', () => {
      const info = new Mp4Info();
      info.fourCC = 'mp4a';
      info.objectTypeIndication = 0x40;
      info.objectType = 2;
      expect(info.toString()).toBe('mp4a.40.2');
    });

    it('assembles a two-element codec string', () => {
      const info = new Mp4Info();
      info.fourCC = 'mp4a';
      info.objectTypeIndication = 0x6b;
      expect(info.toString()).toBe('mp4a.6B');
    });

    it('rejects out-of-range fields', () => {
      expect(() => { new Mp4Info().objectTypeIndication = 256; }).toThrow('objectTypeIndication');
      expect(() => { new Mp4Info().objectType = -1; }).toThrow('objectType');
    });
  });

  describe('invalid input', () => {
    it.each(['mp4a', 'mp4a.40.2.3', 'mp4a.4', 'mp4a.GG', 'mp4a.40.X'])(
      'rejects malformed string %s',
      (str) => {
        expect(() => Mp4Info.fromString(str)).toThrow(/Invalid MP4/);
      },
    );

    it('rejects an unknown 4CC', () => {
      expect(() => Mp4Info.fromString('mp4s.40.2')).toThrow('Unknown codec');
    });
  });
});
