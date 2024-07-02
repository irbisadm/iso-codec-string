import {CodecInfo} from "../codec-info";
import {ColourPrimaries, MatrixCoefficients, TransferCharacteristics, VideoFullRangeFlag} from "../iso-23001-8_2016";

import {VpxBitDepth, VpxChromaSubsampling, VpxLevel, VpxProfile} from "./enums";
import {VpxCodec} from "./codec";
import {bitDepthLimitations, chromaSubsamplingLimitations, profileLimitations} from "./limitations";

const VPX_DEFAULTS = {
  chromaSubsampling: VpxChromaSubsampling.CS_420_COLOCATED_0_0,
  colourPrimaries: ColourPrimaries.BT_709,
  transferCharacteristics: TransferCharacteristics.BT_709,
  matrixCoefficients: MatrixCoefficients.BT_709,
  videoFullRangeFlag: VideoFullRangeFlag.LEGAL,
}

export abstract class VpXInfo extends CodecInfo {


  protected constructor(private codecGeneration: VpxCodec) {
    super();
  }

  protected _profile: VpxProfile = VpxProfile.PROFILE_0;

  get profile(): VpxProfile {
    return this._profile;
  }

  set profile(profile: VpxProfile) {

    const profileLimits = profileLimitations[profile];
    if (!profileLimits.bitDepth.includes(this._bitDepth)) {
      throw new Error(`Profile ${profile} is not compatible with bit depth ${this._bitDepth}`);
    }
    if (!profileLimits.chromaSubsampling.includes(this._chromaSubsampling)) {
      throw new Error(`Profile ${profile} is not compatible with chroma subsampling ${this._chromaSubsampling}`);
    }
    this._profile = profile;
  }

  protected _level: VpxLevel = VpxLevel.UNDEFINED;

  get level(): VpxLevel {
    return this._level;
  }

  set level(level: VpxLevel) {
    this._level = level;
  }

  protected _bitDepth: VpxBitDepth = VpxBitDepth.UNSET;

  get bitDepth(): VpxBitDepth {
    return this._bitDepth;
  }

  set bitDepth(bitDepth: VpxBitDepth) {

    const bitDepthLimits = bitDepthLimitations[bitDepth];
    if (!bitDepthLimits.includes(this._profile)) {
      throw new Error(`Bit depth ${bitDepth} is not compatible with profile ${this._profile}`);
    }
    this._bitDepth = bitDepth;
  }

  protected _chromaSubsampling: VpxChromaSubsampling = VPX_DEFAULTS.chromaSubsampling;

  get chromaSubsampling(): VpxChromaSubsampling {
    return this._chromaSubsampling;
  }

  set chromaSubsampling(chromaSubsampling: VpxChromaSubsampling) {

    const chromaSubsamplingLimits = chromaSubsamplingLimitations[chromaSubsampling];
    if (!chromaSubsamplingLimits.includes(this._profile)) {
      throw new Error(`Chroma subsampling ${chromaSubsampling} is not compatible with profile ${this._profile}`);
    }
    this._chromaSubsampling = chromaSubsampling;
  }

  protected _colourPrimaries: ColourPrimaries = VPX_DEFAULTS.colourPrimaries;

  get colourPrimaries(): ColourPrimaries {
    return this._colourPrimaries;
  }

  set colourPrimaries(colourPrimaries: ColourPrimaries) {
    this._colourPrimaries = colourPrimaries;
  }

  protected _transferCharacteristics = VPX_DEFAULTS.transferCharacteristics;

  get transferCharacteristics(): TransferCharacteristics {
    return this._transferCharacteristics;
  }

  set transferCharacteristics(transferCharacteristics: TransferCharacteristics) {
    this._transferCharacteristics = transferCharacteristics;
  }

  protected _matrixCoefficients = VPX_DEFAULTS.matrixCoefficients;

  get matrixCoefficients(): MatrixCoefficients {
    return this._matrixCoefficients;
  }

  set matrixCoefficients(matrixCoefficients: MatrixCoefficients) {
    this._matrixCoefficients = matrixCoefficients;
  }

  protected _videoFullRangeFlag = VPX_DEFAULTS.videoFullRangeFlag;

  get videoFullRangeFlag(): VideoFullRangeFlag {
    return this._videoFullRangeFlag;
  }

  set videoFullRangeFlag(videoFullRangeFlag: VideoFullRangeFlag) {
    this._videoFullRangeFlag = videoFullRangeFlag;
  }

  toString(skipDefaults = true) {
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
    let canBeSimplified = skipDefaults;
    if (!canBeSimplified || this._videoFullRangeFlag !== VPX_DEFAULTS.videoFullRangeFlag) {
      canBeSimplified = false;
      isoParts.push(this._videoFullRangeFlag);
    }
    if (!canBeSimplified || this._matrixCoefficients !== VPX_DEFAULTS.matrixCoefficients) {
      canBeSimplified = false;
      isoParts.push(this._matrixCoefficients);
    }
    if (!canBeSimplified || this._transferCharacteristics !== VPX_DEFAULTS.transferCharacteristics) {
      canBeSimplified = false;
      isoParts.push(this._transferCharacteristics);
    }
    if (!canBeSimplified || this._colourPrimaries !== VPX_DEFAULTS.colourPrimaries) {
      canBeSimplified = false;
      isoParts.push(this._colourPrimaries);
    }
    if (!canBeSimplified || this._chromaSubsampling !== VPX_DEFAULTS.chromaSubsampling) {
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

  protected fromBox(box: string[]) {
    // <sample entry 4CC>.<profile>.<level>.<bitDepth>.<chromaSubsampling>.
    // <colourPrimaries>.<transferCharacteristics>.<matrixCoefficients>.
    // <videoFullRangeFlag>

    this._chromaSubsampling = VpxChromaSubsampling.UNSET
    this._bitDepth = VpxBitDepth.UNSET

    if (box[1]) {
      this.profile = parseInt(box[1]) as VpxProfile;
    }
    if (box[2]) {
      this.level = box[2] as VpxLevel;
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
