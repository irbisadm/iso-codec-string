import {Av1Info} from "./av1-info";
import {Av1BitDepth, Av1ChromaSamplePosition, Av1Level, Av1Profile, Av1Tier} from "./enums";
import {ColourPrimaries, MatrixCoefficients, TransferCharacteristics, VideoFullRangeFlag} from "../iso-23001-8_2016";

describe('AV1 codecs tests', () => {
  it('without settings', () => {
    const codecInfo = new Av1Info();
    expect(codecInfo.profile).toBe(Av1Profile.UNSET);
    expect(codecInfo.level).toBe(Av1Level.UNSET);
    expect(codecInfo.bitDepth).toBe(Av1BitDepth.UNSET);
    codecInfo.profile = Av1Profile.MAIN;
    codecInfo.level = Av1Level.LEVEL_5_1;
    codecInfo.tier = Av1Tier.MAIN;
    codecInfo.bitDepth = Av1BitDepth.BIT_DEPTH_8;
    codecInfo.monochrome = false;
    codecInfo.chromaSubsampling = '112';
    codecInfo.colorPrimaries = ColourPrimaries.BT_709;
    codecInfo.transferCharacteristics = TransferCharacteristics.BT_709;
    codecInfo.matrixCoefficients = MatrixCoefficients.BT_709;
    codecInfo.videoFullRangeFlag = VideoFullRangeFlag.LEGAL;
    // Spec field widths: profile 1, monochrome 1, videoFullRangeFlag 1, level 2.
    expect('' + codecInfo).toBe('av01.0.13M.08.0.112.01.01.01.0');
  });

  it('parse from string', () => {
    const codecInfo = Av1Info.fromString('av01.0.13M.08.0.112.01.01.01.0');
    expect(codecInfo.profile).toBe(Av1Profile.MAIN);
    expect(codecInfo.level).toBe(Av1Level.LEVEL_5_1);
    expect(codecInfo.tier).toBe(Av1Tier.MAIN);
    expect(codecInfo.bitDepth).toBe(Av1BitDepth.BIT_DEPTH_8);
    expect(codecInfo.monochrome).toBe(false);
    expect(codecInfo.chromaSubsampling).toBe('112');
    expect(codecInfo.colorPrimaries).toBe(ColourPrimaries.BT_709);
    expect(codecInfo.transferCharacteristics).toBe(TransferCharacteristics.BT_709);
    expect(codecInfo.matrixCoefficients).toBe(MatrixCoefficients.BT_709);
    expect(codecInfo.videoFullRangeFlag).toBe(VideoFullRangeFlag.LEGAL);
    expect('' + codecInfo).toBe('av01.0.13M.08.0.112.01.01.01.0');
  });

  describe('round-trip', () => {
    // Canonical example straight from the AV1-ISOBMFF spec.
    it('spec canonical example is idempotent', () => {
      const s = 'av01.0.04M.10.0.112.09.16.09.0';
      const info = Av1Info.fromString(s);
      expect(info.profile).toBe(Av1Profile.MAIN);
      expect(info.level).toBe(Av1Level.LEVEL_3_0);
      expect(info.tier).toBe(Av1Tier.MAIN);
      expect(info.bitDepth).toBe(Av1BitDepth.BIT_DEPTH_10);
      expect(info.colorPrimaries).toBe(ColourPrimaries.BT_2020);
      expect(info.transferCharacteristics).toBe(TransferCharacteristics.SMPTE_2084);
      expect(info.matrixCoefficients).toBe(MatrixCoefficients.BT_2020_NCL);
      expect(info.toString()).toBe(s);
    });

    it('full form is idempotent', () => {
      const s = 'av01.0.13M.08.0.112.01.01.01.0';
      expect(Av1Info.fromString(s).toString()).toBe(s);
    });

    it('minimal input expands to the full 10-field form', () => {
      // toString() always emits every field; missing fields fall back to the
      // AV1-ISOBMFF defaults.
      expect(Av1Info.fromString('av01.0.04M.08').toString())
        .toBe('av01.0.04M.08.0.110.01.01.01.0');
    });

    it('keeps explicit non-default optional fields', () => {
      const s = 'av01.0.04M.08.0.000.02.02.02.0';
      const info = Av1Info.fromString(s);
      expect(info.chromaSubsampling).toBe('000');
      expect(info.colorPrimaries).toBe(ColourPrimaries.UNSPECIFIED);
      expect(info.toString()).toBe(s);
    });

    it('high tier round-trips', () => {
      const s = 'av01.1.19H.12.0.000.02.02.02.0';
      const info = Av1Info.fromString(s);
      expect(info.profile).toBe(Av1Profile.HIGH);
      expect(info.level).toBe(Av1Level.LEVEL_6_3);
      expect(info.tier).toBe(Av1Tier.HIGH);
      expect(info.bitDepth).toBe(Av1BitDepth.BIT_DEPTH_12);
      expect(info.toString()).toBe(s);
    });
  });

  describe('level padding', () => {
    // Regression: levels < 10 must keep two digits ("00M", not "0M").
    it('zero-pads a single-digit level to two digits', () => {
      const info = new Av1Info();
      info.profile = Av1Profile.MAIN;
      info.level = Av1Level.LEVEL_2_0; // seq_level_idx = 0
      info.tier = Av1Tier.MAIN;
      info.bitDepth = Av1BitDepth.BIT_DEPTH_8;
      expect(info.toString()).toBe('av01.0.00M.08.0.110.01.01.01.0');
    });

    it('keeps two-digit levels as-is', () => {
      const info = new Av1Info();
      info.profile = Av1Profile.PROFESSIONAL;
      info.level = Av1Level.LEVEL_6_3; // seq_level_idx = 19
      info.tier = Av1Tier.HIGH;
      info.bitDepth = Av1BitDepth.BIT_DEPTH_12;
      expect(info.toString()).toBe('av01.2.19H.12.0.110.01.01.01.0');
    });
  });

  describe('monochrome', () => {
    it('emits monochrome as a single digit', () => {
      const info = new Av1Info();
      info.profile = Av1Profile.MAIN;
      info.level = Av1Level.LEVEL_5_1;
      info.tier = Av1Tier.MAIN;
      info.bitDepth = Av1BitDepth.BIT_DEPTH_8;
      info.monochrome = true;
      expect(info.toString()).toBe('av01.0.13M.08.1.110.01.01.01.0');
    });
  });

  describe('chromaSubsampling getter/setter', () => {
    it.each([
      ['112', true, true, Av1ChromaSamplePosition.COLOCATED_WITH_LUMA],
      ['110', true, true, Av1ChromaSamplePosition.UNKNOWN],
      ['100', true, false, Av1ChromaSamplePosition.UNKNOWN],
      ['000', false, false, Av1ChromaSamplePosition.UNKNOWN],
    ])('round-trips %s', (value) => {
      const info = new Av1Info();
      info.chromaSubsampling = value as string;
      expect(info.chromaSubsampling).toBe(value);
    });
  });

  describe('parsing leniency', () => {
    // The old (pre-fix) serializer padded every field to two digits; fromString
    // must still accept those strings for backward compatibility.
    it('accepts the legacy two-digit-padded form', () => {
      const info = Av1Info.fromString('av01.00.13M.08.00.112.01.01.01.00');
      expect(info.profile).toBe(Av1Profile.MAIN);
      expect(info.level).toBe(Av1Level.LEVEL_5_1);
      expect(info.monochrome).toBe(false);
      expect(info.videoFullRangeFlag).toBe(VideoFullRangeFlag.LEGAL);
    });

    // AV1-ISOBMFF: the string SHALL be interpreted ignoring everything from the
    // first character that is not '.', a digit, part of the 4CC or a tier value.
    it.each([
      ['av01.0.13M.08+extra', 'av01.0.13M.08.0.110.01.01.01.0'],
      ['av01.0.13M.08.0.112.01.01.01.0;x', 'av01.0.13M.08.0.112.01.01.01.0'],
    ])('ignores the trailing characters of %s', (str, expected) => {
      expect(Av1Info.fromString(str).toString()).toBe(expected);
    });
  });

  describe('mandatory fields', () => {
    // Regression: truncated strings used to parse and serialize with -1 sentinels,
    // e.g. av01.0.13M -> av01.0.13M.-1.0.000.02.02.02.0
    it.each([
      ['av01'],
      ['av01.0'],
      ['av01.0.13M'],
      ['av01..13M.08'],
      ['av01.0..08'],
      ['av01.0.13M.'],
      ['av01.0.13.08'],
      ['av01.0.M.08'],
      ['av01.0.13X.08'],
      ['av01.x.13M.08'],
      ['av01.0.13M.x'],
    ])('rejects %s', (str) => {
      expect(() => Av1Info.fromString(str)).toThrow(
        'Invalid AV1 codec string, expected av01.<profile>.<level><tier>.<bitDepth>[.fields]'
      );
    });

    it('still accepts the shortest legal form', () => {
      expect(Av1Info.fromString('av01.0.13M.08').bitDepth).toBe(Av1BitDepth.BIT_DEPTH_8);
    });
  });

  describe('optional field defaults', () => {
    // Regression: omitted fields used to read as 4:4:4 with unspecified colour.
    it.each([
      ['parsed short form', () => Av1Info.fromString('av01.0.13M.08')],
      ['new instance', () => new Av1Info()],
    ])('%s uses the AV1-ISOBMFF defaults', (_name, build) => {
      const info = build();
      expect(info.monochrome).toBe(false);
      expect(info.chromaSubsampling).toBe('110');
      expect(info.colorPrimaries).toBe(ColourPrimaries.BT_709);
      expect(info.transferCharacteristics).toBe(TransferCharacteristics.BT_709);
      expect(info.matrixCoefficients).toBe(MatrixCoefficients.BT_709);
      expect(info.videoFullRangeFlag).toBe(VideoFullRangeFlag.LEGAL);
    });

    it('reports 4:2:0 BT.709 in the human-readable form', () => {
      expect(Av1Info.fromString('av01.0.13M.08').toHumanReadable()).toMatchObject({
        chromaSubsamplingX: true,
        chromaSubsamplingY: true,
        colourPrimaries: 'bt.709',
        transferCharacteristics: 'bt.709',
        matrixCoefficients: 'bt.709',
      });
    });
  });

  describe('value ranges', () => {
    it.each([
      ['av01.3.13M.08', 'Invalid AV1 profile 3: expected 0, 1 or 2'],
      ['av01.9.13M.08', 'Invalid AV1 profile 9: expected 0, 1 or 2'],
      ['av01.0.24M.08', 'Invalid AV1 level 24: expected 0-23 or 31'],
      ['av01.0.99M.08', 'Invalid AV1 level 99: expected 0-23 or 31'],
      ['av01.0.13M.09', 'Invalid AV1 bit depth 9: expected 8, 10 or 12'],
    ])('rejects %s', (str, message) => {
      expect(() => Av1Info.fromString(str)).toThrow(message);
    });

    it('rejects out-of-range values assigned through setters', () => {
      const info = new Av1Info();
      expect(() => { info.profile = 9 as Av1Profile; }).toThrow('Invalid AV1 profile 9');
      expect(() => { info.level = 99 as Av1Level; }).toThrow('Invalid AV1 level 99');
      expect(() => { info.bitDepth = 9 as Av1BitDepth; }).toThrow('Invalid AV1 bit depth 9');
    });

    it('accepts the maximum parameters level (seq_level_idx 31)', () => {
      const info = Av1Info.fromString('av01.0.31M.08');
      expect(info.level).toBe(Av1Level.MAX_PARAMETERS);
      expect(info.toHumanReadable().level).toBe('max parameters');
    });

    it('accepts every level from 0 to 23', () => {
      for (let level = 0; level <= 23; level++) {
        expect(Av1Info.fromString(`av01.0.${level}M.08`).level).toBe(level);
      }
    });
  });

  describe('toHumanReadable', () => {
    it('maps every field to a display value', () => {
      const info = Av1Info.fromString('av01.0.13M.08.0.112.01.01.01.0');
      expect(info.toHumanReadable()).toEqual({
        profile: 'main',
        level: '5.1',
        tier: 'main',
        bitDepth: '8',
        monochrome: false,
        chromaSubsamplingX: true,
        chromaSubsamplingY: true,
        chromaSamplePosition: 'colocated with luma',
        colourPrimaries: 'bt.709',
        transferCharacteristics: 'bt.709',
        matrixCoefficients: 'bt.709',
        videoFullRangeFlag: 'legal',
      });
    });
  });
});
