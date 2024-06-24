import {ColourPrimaries} from "../iso-23001-8_2016";
import {Vp8Info} from "./vp8-info";
import {VpxBitDepth, VpxChromaSubsampling, VpxLevel, VpxProfile, VpxVideoFullRangeFlag} from "./enums";

describe('VP8 codecs tests', () => {
  it('without settings', () => {
    const codecInfo = new Vp8Info();
    expect(codecInfo.profile).toBe(VpxProfile.PROFILE_0);
    expect(codecInfo.level).toBe(VpxLevel.UNDEFINED);
    expect(codecInfo.chromaSubsampling).toBe(VpxChromaSubsampling.CS_420_COLOCATED_0_0);
    expect(codecInfo.colourPrimaries).toBe(ColourPrimaries.BT_709);
    expect(''+codecInfo).toBe('vp08');
  })
  it('vp0 full box', () => {
    const codecInfo = new Vp8Info();
    codecInfo.videoFullRangeFlag = VpxVideoFullRangeFlag.FULL;
    codecInfo.bitDepth = VpxBitDepth.BIT_DEPTH_8;
    expect(''+codecInfo).toBe('vp08.00.00.08.01.01.01.01.01');
  })
  it('set profile 0', () => {
    const codecInfo = new Vp8Info();
    codecInfo.profile = VpxProfile.PROFILE_0;
    expect(''+codecInfo).toBe('vp08');
  })
  it('set profiles 1-2-3', () => {
    const codecInfo = new Vp8Info();
    expect(()=>{codecInfo.profile = VpxProfile.PROFILE_1}).toThrow('VP8 only supports a profile value of 0.');
    expect(codecInfo.profile).toBe(VpxProfile.PROFILE_0);
    expect(()=>{codecInfo.profile = VpxProfile.PROFILE_2}).toThrow('VP8 only supports a profile value of 0.');
    expect(codecInfo.profile).toBe(VpxProfile.PROFILE_0);
    expect(()=>{codecInfo.profile = VpxProfile.PROFILE_3}).toThrow('VP8 only supports a profile value of 0.');
    expect(codecInfo.profile).toBe(VpxProfile.PROFILE_0);
  })
})
