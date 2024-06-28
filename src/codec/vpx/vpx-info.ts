import {CodecInfo} from "../codec-info";
import {ColourPrimaries, TransferCharacteristics, MatrixCoefficients, VideoFullRangeFlag} from "../iso-23001-8_2016";

import {VpxBitDepth, VpxChromaSubsampling, VpxLevel, VpxProfile} from "./enums";
import {VpxCodec} from "./codec";

export abstract class VpXInfo extends CodecInfo {
  private DEFAULTS = {
    chromaSubsampling: VpxChromaSubsampling.CS_420_COLOCATED_0_0,
    colourPrimaries: ColourPrimaries.BT_709,
    transferCharacteristics: TransferCharacteristics.BT_709,
    matrixCoefficients: MatrixCoefficients.BT_709,
    videoFullRangeFlag: VideoFullRangeFlag.LEGAL,
  }

  protected _profile: VpxProfile = VpxProfile.PROFILE_0;
  protected _level: VpxLevel = VpxLevel.UNDEFINED;
  protected _bitDepth: VpxBitDepth = VpxBitDepth.UNSET;
  protected _chromaSubsampling: VpxChromaSubsampling = this.DEFAULTS.chromaSubsampling;
  protected _colourPrimaries: ColourPrimaries = this.DEFAULTS.colourPrimaries;
  protected _transferCharacteristics = this.DEFAULTS.transferCharacteristics;
  protected _matrixCoefficients = this.DEFAULTS.matrixCoefficients;
  protected _videoFullRangeFlag = this.DEFAULTS.videoFullRangeFlag;

  protected constructor(private codecGeneration: VpxCodec) {
    super();
  }

  toString(withoutDefaults = true) {
    if (this._profile === VpxProfile.UNSET || this._bitDepth === VpxBitDepth.UNSET) {
      if (this.codecGeneration === VpxCodec.VP8) {
        return this.codecGeneration;
      }
      throw new Error('Profile, level and bit depth must be set');
    }

    const isoParts = [];

    // <sample entry 4CC>.<profile>.<level>.<bitDepth>.<chromaSubsampling>.
    // <colourPrimaries>.<transferCharacteristics>.<matrixCoefficients>.
    // <videoFullRangeFlag>
    let canBeSimplified = withoutDefaults;
    if (!canBeSimplified || this._videoFullRangeFlag !== this.DEFAULTS.videoFullRangeFlag) {
      canBeSimplified = false;
      isoParts.push(this._videoFullRangeFlag);
    }
    if (!canBeSimplified || this._matrixCoefficients !== this.DEFAULTS.matrixCoefficients) {
      canBeSimplified = false;
      isoParts.push(this._matrixCoefficients);
    }
    if (!canBeSimplified || this._transferCharacteristics !== this.DEFAULTS.transferCharacteristics) {
      canBeSimplified = false;
      isoParts.push(this._transferCharacteristics);
    }
    if (!canBeSimplified || this._colourPrimaries !== this.DEFAULTS.colourPrimaries) {
      canBeSimplified = false;
      isoParts.push(this._colourPrimaries);
    }
    if (!canBeSimplified || this._chromaSubsampling !== this.DEFAULTS.chromaSubsampling) {
      isoParts.push(this._chromaSubsampling);
    }
    isoParts.push(this._bitDepth);
    isoParts.push(this._level);
    isoParts.push(this._profile);
    isoParts.push(this.codecGeneration);
    return isoParts
      .reverse()
      .map(record => {
        const strRecord = record.toString();
        if (strRecord.length < 2) {
          return '0' + strRecord;
        }
        return strRecord;
      })
      .join('.');
  }


  get profile(): VpxProfile {
    return this._profile;
  }

  set profile(profile: VpxProfile) {
    const limitations: Record<VpxProfile, { bitDepth: VpxBitDepth[], chromaSubsampling: VpxChromaSubsampling[] }> = {
      [VpxProfile.PROFILE_0]: {
        bitDepth: [VpxBitDepth.BIT_DEPTH_8, VpxBitDepth.UNSET],
        chromaSubsampling: [VpxChromaSubsampling.CS_420_COLOCATED_0_0, VpxChromaSubsampling.CS_420_VERTICAL, VpxChromaSubsampling.UNSET]
      },
      [VpxProfile.PROFILE_1]: {
        bitDepth: [VpxBitDepth.BIT_DEPTH_8, VpxBitDepth.UNSET],
        chromaSubsampling: [VpxChromaSubsampling.CS_422, VpxChromaSubsampling.CS_444, VpxChromaSubsampling.UNSET]
      },
      [VpxProfile.PROFILE_2]: {
        bitDepth: [VpxBitDepth.BIT_DEPTH_10, VpxBitDepth.BIT_DEPTH_12, VpxBitDepth.UNSET],
        chromaSubsampling: [VpxChromaSubsampling.CS_420_COLOCATED_0_0, VpxChromaSubsampling.CS_420_VERTICAL, VpxChromaSubsampling.UNSET]
      },
      [VpxProfile.PROFILE_3]: {
        bitDepth: [VpxBitDepth.BIT_DEPTH_10, VpxBitDepth.BIT_DEPTH_12, VpxBitDepth.UNSET],
        chromaSubsampling: [VpxChromaSubsampling.CS_422, VpxChromaSubsampling.CS_444, VpxChromaSubsampling.UNSET]
      },
      [VpxProfile.UNSET]: {
        bitDepth: [VpxBitDepth.UNSET, VpxBitDepth.BIT_DEPTH_8, VpxBitDepth.BIT_DEPTH_12, VpxBitDepth.BIT_DEPTH_10],
        chromaSubsampling: [VpxChromaSubsampling.UNSET, VpxChromaSubsampling.CS_420_VERTICAL, VpxChromaSubsampling.CS_420_COLOCATED_0_0, VpxChromaSubsampling.CS_422, VpxChromaSubsampling.CS_444]
      }
    }
    const profileLimits = limitations[profile];
    if (!profileLimits.bitDepth.includes(this._bitDepth)) {
      throw new Error(`Profile ${profile} is not compatible with bit depth ${this._bitDepth}`);
    }
    if (!profileLimits.chromaSubsampling.includes(this._chromaSubsampling)) {
      throw new Error(`Profile ${profile} is not compatible with chroma subsampling ${this._chromaSubsampling}`);
    }
    this._profile = profile;
  }

  get bitDepth(): VpxBitDepth {
    return this._bitDepth;
  }

  set bitDepth(bitDepth: VpxBitDepth) {
    const limitations: Record<VpxBitDepth, VpxProfile[]> = {
      [VpxBitDepth.BIT_DEPTH_8]: [VpxProfile.PROFILE_0, VpxProfile.PROFILE_1, VpxProfile.UNSET],
      [VpxBitDepth.BIT_DEPTH_10]: [VpxProfile.PROFILE_2, VpxProfile.PROFILE_3, VpxProfile.UNSET],
      [VpxBitDepth.BIT_DEPTH_12]: [VpxProfile.PROFILE_2, VpxProfile.PROFILE_3, VpxProfile.UNSET],
      [VpxBitDepth.UNSET]: [VpxProfile.UNSET, VpxProfile.PROFILE_0, VpxProfile.PROFILE_1, VpxProfile.PROFILE_2, VpxProfile.PROFILE_3]
    }
    const bitDepthLimits = limitations[bitDepth];
    if (!bitDepthLimits.includes(this._profile)) {
      throw new Error(`Bit depth ${bitDepth} is not compatible with profile ${this._profile}`);
    }
    this._bitDepth = bitDepth;
  }

  get chromaSubsampling(): VpxChromaSubsampling {
    return this._chromaSubsampling;
  }

  set chromaSubsampling(chromaSubsampling: VpxChromaSubsampling) {
    const limitations: Record<VpxChromaSubsampling, VpxProfile[]> = {
      [VpxChromaSubsampling.CS_420_COLOCATED_0_0]: [VpxProfile.PROFILE_0, VpxProfile.PROFILE_2, VpxProfile.UNSET],
      [VpxChromaSubsampling.CS_420_VERTICAL]: [VpxProfile.PROFILE_0, VpxProfile.PROFILE_2, VpxProfile.UNSET],
      [VpxChromaSubsampling.CS_422]: [VpxProfile.PROFILE_1, VpxProfile.PROFILE_3, VpxProfile.UNSET],
      [VpxChromaSubsampling.CS_444]: [VpxProfile.PROFILE_1, VpxProfile.PROFILE_3, VpxProfile.UNSET],
      [VpxChromaSubsampling.UNSET]: [VpxProfile.UNSET, VpxProfile.PROFILE_0, VpxProfile.PROFILE_1, VpxProfile.PROFILE_2, VpxProfile.PROFILE_3]
    }
    const chromaSubsamplingLimits = limitations[chromaSubsampling];
    if (!chromaSubsamplingLimits.includes(this._profile)) {
      throw new Error(`Chroma subsampling ${chromaSubsampling} is not compatible with profile ${this._profile}`);
    }
    this._chromaSubsampling = chromaSubsampling;
  }

  get level(): VpxLevel {
    return this._level;
  }

  set level(level: VpxLevel) {
    this._level = level;
  }

  get colourPrimaries(): ColourPrimaries {
    return this._colourPrimaries;
  }

  set colourPrimaries(colourPrimaries: ColourPrimaries) {
    this._colourPrimaries = colourPrimaries;
  }

  get transferCharacteristics(): TransferCharacteristics {
    return this._transferCharacteristics;
  }

  set transferCharacteristics(transferCharacteristics: TransferCharacteristics) {
    this._transferCharacteristics = transferCharacteristics;
  }

  get matrixCoefficients(): MatrixCoefficients {
    return this._matrixCoefficients;
  }

  set matrixCoefficients(matrixCoefficients: MatrixCoefficients) {
    this._matrixCoefficients = matrixCoefficients;
  }

  get videoFullRangeFlag(): VideoFullRangeFlag {
    return this._videoFullRangeFlag;
  }

  set videoFullRangeFlag(videoFullRangeFlag: VideoFullRangeFlag) {
    this._videoFullRangeFlag = videoFullRangeFlag;
  }

  protected fromBox(box: string[]) {
    // <sample entry 4CC>.<profile>.<level>.<bitDepth>.<chromaSubsampling>.
    // <colourPrimaries>.<transferCharacteristics>.<matrixCoefficients>.
    // <videoFullRangeFlag>

    if (box[1]) {
      this.profile = parseInt(box[1]) as VpxProfile;
    }
    if (box[2]) {
      this.level = parseInt(box[2]).toString() as VpxLevel;
    }
    if (box[3]) {
      this.bitDepth = parseInt(box[3]) as VpxBitDepth;
    }
    if (box[4]) {
      this.chromaSubsampling = parseInt(box[4]) as VpxChromaSubsampling;
    }
    if (box[5]) {
      this.colourPrimaries = parseInt(box[5]) as ColourPrimaries;
    }
    if (box[6]) {
      this.transferCharacteristics = parseInt(box[6]) as TransferCharacteristics;
    }
    if (box[7]) {
      this.matrixCoefficients = parseInt(box[7]) as MatrixCoefficients;
    }
    if (box[8]) {
      this.videoFullRangeFlag = parseInt(box[8]) as VideoFullRangeFlag;
    }

    if (box.length > 9) {
      throw new Error('Invalid box');
    }

  }
}
