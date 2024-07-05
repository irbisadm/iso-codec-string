import {Av1Info} from "./av1-info";
import {Av1BitDepth, Av1Level, Av1Profile, Av1Tier} from "./enums";
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
    expect('' + codecInfo).toBe('av01.00.13M.08.00.112.01.01.01.00');
  });
  it('parse from string', () => {
    const codecInfo = Av1Info.fromString('av01.00.13M.08.00.112.01.01.01.00');
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
    expect('' + codecInfo).toBe('av01.00.13M.08.00.112.01.01.01.00');
  })
})