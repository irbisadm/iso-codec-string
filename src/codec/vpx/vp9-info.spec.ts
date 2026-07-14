import {VpxBitDepth, VpxChromaSubsampling, VpxLevel, VpxProfile} from "./enums";
import {ColourPrimaries, VideoFullRangeFlag} from "../iso-23001-8_2016";
import {Vp9Info} from "./vp9-info";

const testStringsBuilder = (): string[] => {
  const levels = ['00', '10', '11', '20', '21', '30', '31', '40', '41', '50', '51', '52', '60', '61', '62'];
  const makeWithLevel = (profile: string, bitDepth: string[], chromaSubsampling: string[]) => {
    const samples: string[] = [];
    levels.forEach(level => {
      const prfx = `vp09.${profile}.${level}`;
      bitDepth.forEach(bd => {
        chromaSubsampling.forEach(cs => {
          samples.push(`${prfx}.${bd}.${cs}`);
        })
      });
    })
    return samples;
  }

  const profile0 = makeWithLevel('00', ['08'], ['00', '01']);
  const profile1 = makeWithLevel('01', ['08'], ['02', '03']);
  const profile2 = makeWithLevel('02', ['10', '12'], ['00', '01']);
  const profile3 = makeWithLevel('03', ['10', '12'], ['02', '03']);

  const validHeaders = [...profile0, ...profile1, ...profile2, ...profile3];

  const pickR = (arr: string[]) => {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const testSuite: string[] = [];

  const colourPrimaries = ['01', '02', '04', '05', '06', '07', '08', '09', '10', '11', '12', '22'];
  const transferCharacteristics = ['01', '02', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
  const matrixCoefficients = ['00', '01', '02', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
  const videoFullRangeFlag = ['00', '01'];
  // <sample entry 4CC>.<profile>.<level>.<bitDepth>.<chromaSubsampling>.
  // <colourPrimaries>.<transferCharacteristics>.<matrixCoefficients>.
  // <videoFullRangeFlag>
  for (const header of validHeaders) {
    for(const cp of colourPrimaries) {
      for (const tc of transferCharacteristics) {
        for (const mc of matrixCoefficients) {
          for (const vfrf of videoFullRangeFlag) {
            testSuite.push(`${header}.${cp}.${tc}.${mc}.${vfrf}`);
          }
        }
      }
    }
  }
  return testSuite;
}

describe('VP9 codecs tests', () => {
  it('without settings', () => {
    const codecInfo = new Vp9Info();
    expect(codecInfo.profile).toBe(VpxProfile.PROFILE_0);
    expect(codecInfo.level).toBe(VpxLevel.UNDEFINED);
    expect(codecInfo.chromaSubsampling).toBe(VpxChromaSubsampling.CS_420_COLOCATED_0_0);
    expect(codecInfo.colourPrimaries).toBe(ColourPrimaries.BT_709);
    codecInfo.level = VpxLevel.LEVEL_5_1;
    codecInfo.bitDepth = VpxBitDepth.BIT_DEPTH_8;
    expect('' + codecInfo).toBe('vp09.00.51.08');
  })
  it('parse all strings', () => {
    const testStrings = testStringsBuilder();
    for (let i = 0; i < testStrings.length; i++) {
      const codecInfo = Vp9Info.fromString(testStrings[i]);
      expect(codecInfo.toString(false)).toBe(testStrings[i]);
    }
  })

  describe('default inference in fromBox', () => {
    it.each([
      ['vp09.02', VpxProfile.PROFILE_2, VpxBitDepth.BIT_DEPTH_10, VpxChromaSubsampling.CS_420_COLOCATED_0_0],
      ['vp09.01', VpxProfile.PROFILE_1, VpxBitDepth.BIT_DEPTH_8, VpxChromaSubsampling.CS_422],
      ['vp09.03', VpxProfile.PROFILE_3, VpxBitDepth.BIT_DEPTH_10, VpxChromaSubsampling.CS_422],
    ])('%s fills bit depth and chroma from the profile', (str, profile, bitDepth, chroma) => {
      const info = Vp9Info.fromString(str as string);
      expect(info.profile).toBe(profile);
      expect(info.bitDepth).toBe(bitDepth);
      expect(info.chromaSubsampling).toBe(chroma);
    })
  })

  describe('validation', () => {
    it('rejects a bit depth incompatible with the profile', () => {
      expect(() => Vp9Info.fromString('vp09.00.00.10'))
        .toThrow('Bit depth 10 is not compatible with profile 0');
    })

    it('rejects a chroma subsampling incompatible with the profile', () => {
      expect(() => Vp9Info.fromString('vp09.00.00.08.02'))
        .toThrow('Chroma subsampling 2 is not compatible with profile 0');
    })

    it('rejects a 4:2:0 vertical subsampling on profile 1', () => {
      expect(() => Vp9Info.fromString('vp09.01.00.08.00'))
        .toThrow('Chroma subsampling 0 is not compatible with profile 1');
    })

    it('rejects a box with more than nine fields', () => {
      expect(() => Vp9Info.fromString('vp09.00.00.08.01.01.01.01.01.00'))
        .toThrow('Invalid box');
    })

    it('setter validation is order-sensitive', () => {
      const info = new Vp9Info();
      info.profile = VpxProfile.PROFILE_2; // ok while bit depth is still unset
      expect(() => { info.bitDepth = VpxBitDepth.BIT_DEPTH_8; })
        .toThrow('Bit depth 8 is not compatible with profile 2');
    })

    it('rejects 10-bit on the default profile 0', () => {
      expect(() => { new Vp9Info().bitDepth = VpxBitDepth.BIT_DEPTH_10; })
        .toThrow('Bit depth 10 is not compatible with profile 0');
    })
  })

  describe('serialization', () => {
    it('emits the minimal form when colour fields are default', () => {
      const info = new Vp9Info();
      info.level = VpxLevel.LEVEL_5_1;
      info.bitDepth = VpxBitDepth.BIT_DEPTH_8;
      expect(info.toString()).toBe('vp09.00.51.08');
    })

    it('expands every field once a colour field is non-default', () => {
      const info = new Vp9Info();
      info.level = VpxLevel.LEVEL_5_1;
      info.bitDepth = VpxBitDepth.BIT_DEPTH_8;
      info.videoFullRangeFlag = VideoFullRangeFlag.FULL;
      expect(info.toString()).toBe('vp09.00.51.08.01.01.01.01.01');
    })

    it('exposes the codec name', () => {
      expect(new Vp9Info().codecName).toBe('vp9');
    })
  })
})
