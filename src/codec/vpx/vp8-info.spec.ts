import {ColourPrimaries, VideoFullRangeFlag} from "../iso-23001-8_2016";
import {Vp8Info} from "./vp8-info";
import {VpxBitDepth, VpxChromaSubsampling, VpxLevel, VpxProfile} from "./enums";

describe('VP8 codecs tests', () => {
  it('without settings', () => {
    const codecInfo = new Vp8Info();
    expect(codecInfo.profile).toBe(VpxProfile.PROFILE_0);
    expect(codecInfo.level).toBe(VpxLevel.UNDEFINED);
    expect(codecInfo.chromaSubsampling).toBe(VpxChromaSubsampling.CS_420_COLOCATED_0_0);
    expect(codecInfo.colourPrimaries).toBe(ColourPrimaries.BT_709);
    expect('' + codecInfo).toBe('vp08');
  })
  it('vp0 full box', () => {
    const codecInfo = new Vp8Info();
    codecInfo.videoFullRangeFlag = VideoFullRangeFlag.FULL;
    codecInfo.bitDepth = VpxBitDepth.BIT_DEPTH_8;
    expect('' + codecInfo).toBe('vp08.00.00.08.01.01.01.01.01');
  })
  it('set profile 0', () => {
    const codecInfo = new Vp8Info();
    codecInfo.profile = VpxProfile.PROFILE_0;
    expect('' + codecInfo).toBe('vp08');
  })
  it('set profiles 1-2-3', () => {
    const codecInfo = new Vp8Info();
    expect(() => {
      codecInfo.profile = VpxProfile.PROFILE_1
    }).toThrow('VP8 only supports a profile value of 0.');
    expect(codecInfo.profile).toBe(VpxProfile.PROFILE_0);
    expect(() => {
      codecInfo.profile = VpxProfile.PROFILE_2
    }).toThrow('VP8 only supports a profile value of 0.');
    expect(codecInfo.profile).toBe(VpxProfile.PROFILE_0);
    expect(() => {
      codecInfo.profile = VpxProfile.PROFILE_3
    }).toThrow('VP8 only supports a profile value of 0.');
    expect(codecInfo.profile).toBe(VpxProfile.PROFILE_0);
  })

  describe('fromString', () => {
    it.each(['vp8', 'vp08'])('parses %s to the parameterless short form', (str) => {
      const info = Vp8Info.fromString(str);
      expect(info.codecName).toBe('vp8');
      expect(info.profile).toBe(VpxProfile.PROFILE_0);
      // A bare codec string carries no fields, so bit depth stays unset.
      expect(info.bitDepth).toBe(VpxBitDepth.UNSET);
      expect(info.toString()).toBe('vp08');
    })

    it('round-trips a full box via toString(false)', () => {
      const s = 'vp08.00.00.08.01.01.01.01.01';
      const info = Vp8Info.fromString(s);
      expect(info.chromaSubsampling).toBe(VpxChromaSubsampling.CS_420_COLOCATED_0_0);
      expect(info.videoFullRangeFlag).toBe(VideoFullRangeFlag.FULL);
      expect(info.toString(false)).toBe(s);
    })

    it('shortens a full box with default colour fields', () => {
      expect(Vp8Info.fromString('vp08.00.00.08').toString()).toBe('vp08.00.00.08');
    })

    it('rejects a non-zero profile', () => {
      expect(() => Vp8Info.fromString('vp08.01.00.08'))
        .toThrow('VP8 only supports a profile value of 0.');
    })
  })

  describe('toString', () => {
    it('emits the short form when bit depth is unset', () => {
      expect(new Vp8Info().toString()).toBe('vp08');
    })

    it.each(['vp8', 'vp08'])('round-trips the bare short form %s', (str) => {
      expect(Vp8Info.fromString(str).toString()).toBe('vp08');
    })
  })
})
