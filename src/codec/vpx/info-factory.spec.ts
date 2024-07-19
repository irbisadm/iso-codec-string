import {vpxInfoFactory} from "./info-factory";
import {VpxBitDepth, VpxChromaSubsampling, VpxLevel, VpxProfile} from "./enums";
import {ColourPrimaries, MatrixCoefficients, TransferCharacteristics, VideoFullRangeFlag} from "../iso-23001-8_2016";

describe('VpX string parser', () => {
  it('should parse vp8', () => {
    const info = vpxInfoFactory('vp8');
    expect(info.codecName).toBe('vp8');
  })
  it('should parse vp8', () => {
    const info = vpxInfoFactory('vp08');
    expect(info.codecName).toBe('vp8');
  })
  it('should throw error on unknown codec', () => {
    expect(() => vpxInfoFactory('vp10.0.0')).toThrowError('Unknown codec');
  })
  it('should parse vp9', () => {
    const info = vpxInfoFactory('vp9');
    expect(info.codecName).toBe('vp9');
  })
  it('should parse vp9', () => {
    const info = vpxInfoFactory('vp09');
    expect(info.codecName).toBe('vp9');
    expect(info.profile).toBe(VpxProfile.PROFILE_0);
    expect(info.level).toBe(VpxLevel.UNDEFINED);
    expect(info.bitDepth).toBe(VpxBitDepth.BIT_DEPTH_8);
    expect(info.chromaSubsampling).toBe(VpxChromaSubsampling.CS_420_COLOCATED_0_0);
  })
  it('vp09.02.10.10.01.09.16.09.01', () => {
    const info = vpxInfoFactory('vp09.02.10.10.01.09.16.09.01');
    expect(info.codecName).toBe('vp9');
    expect(info.profile).toBe(VpxProfile.PROFILE_2);
    expect(info.level).toBe(VpxLevel.LEVEL_1);
    expect(info.bitDepth).toBe(VpxBitDepth.BIT_DEPTH_10);
    expect(info.chromaSubsampling).toBe(VpxChromaSubsampling.CS_420_COLOCATED_0_0);
    expect(info.colourPrimaries).toBe(ColourPrimaries.BT_2020);
    expect(info.transferCharacteristics).toBe(TransferCharacteristics.SMPTE_2084);
    expect(info.matrixCoefficients).toBe(MatrixCoefficients.BT_2020_NCL)
    expect(info.videoFullRangeFlag).toBe(VideoFullRangeFlag.FULL);
  })
})