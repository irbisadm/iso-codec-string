enum VpxCodec {
  VP8 = 'vp08',
  VP9 = 'vp09',
}

export enum VpxProfile {
  UNSET = -1,
  PROFILE_0,
  PROFILE_1,
  PROFILE_2,
  PROFILE_3,
}

export enum VpxLevel {
  UNDEFINED = '0',
  LEVEL_1 = '10',
  LEVEL_1_1 = '11',
  LEVEL_2 = '20',
  LEVEL_2_1 = '21',
  LEVEL_3 = '30',
  LEVEL_3_1 = '31',
  LEVEL_4 = '40',
  LEVEL_4_1 = '41',
  LEVEL_5 = '50',
  LEVEL_5_1 = '51',
  LEVEL_5_2 = '52',
  LEVEL_6 = '60',
  LEVEL_6_1 = '61',
  LEVEL_6_2 = '62',
}

export enum VpxBitDepth {
  UNSET = -1,
  BIT_DEPTH_8 = 8,
  BIT_DEPTH_10 = 10,
  BIT_DEPTH_12 = 12,
}

export enum VpxChromaSubsampling {
  UNSET = -1,
  CS_420_VERTICAL = 0,
  CS_420_COLOCATED_0_0 = 1,
  CS_422 = 2,
  CS_444 = 3,
}


export enum VpxColourPrimaries {
  BT_709 = 1,
  UNSPECIFIED = 2,
  BT_470M = 4,
  BT_470BG = 5,
  SMPTE_170 = 6,
  SMPTE_240 = 7,
  GENERIC_FILM = 8,
  BT_2020 = 9,
  SMPTE_428 = 10,
  SMPTE_431 = 11,
  SMPTE_432 = 12,
  EBU_3213E = 22,
}

export enum VpxTransferCharacteristics {
  BT_709 = 1,
  UNSPECIFIED = 2,
  BT_470M = 4,
  BT_470BG = 5,
  SMPTE_170 = 6,
  SMPTE_240 = 7,
  LINEAR = 8,
  LOG_100 = 9,
  LOG_100_SQRT = 10,
  IEC_61966_2_4 = 11,
  BT_1361 = 12,
  SRGB = 13,
  BT_2020_10_BIT = 14,
  BT_2020_12_BIT = 15,
  SMPTE_2084 = 16,
  SMPTE_428 = 17,
  ARIB_STD_B67 = 18,
}

export enum VpxMatrixCoefficients {
  RGB = 0,
  BT_709 = 1,
  UNSPECIFIED = 2,
  BT_470M = 4,
  BT_470BG = 5,
  SMPTE_170 = 6,
  SMPTE_240 = 7,
  YCOCG = 8,
  BT_2020_NCL = 9,
  BT_2020_CL = 10,
  SMPTE_2085 = 11,
  CHROMAT_NCL = 12,
  CHROMAT_CL = 13,
  ITP_1667 = 14,
  SMPTE_428 = 15,
  SMPTE_431 = 16,
  SMPTE_432 = 17,
  EBU_3213E = 18,
}

export enum VpxVideoFullRangeFlag {
  LEGAL = 0,
  FULL = 1,
}

abstract class VpXInfo {
  private DEFAULTS = {
    chromaSubsampling: VpxChromaSubsampling.CS_420_COLOCATED_0_0,
    colourPrimaries: VpxColourPrimaries.BT_709,
    transferCharacteristics: VpxTransferCharacteristics.BT_709,
    matrixCoefficients: VpxMatrixCoefficients.BT_709,
    videoFullRangeFlag: VpxVideoFullRangeFlag.LEGAL,
  }

  protected _profile: VpxProfile = VpxProfile.PROFILE_0;
  protected _level: VpxLevel = VpxLevel.UNDEFINED;
  protected _bitDepth: VpxBitDepth = VpxBitDepth.UNSET;
  protected _chromaSubsampling: VpxChromaSubsampling = this.DEFAULTS.chromaSubsampling;
  protected _colourPrimaries: VpxColourPrimaries = this.DEFAULTS.colourPrimaries;
  protected _transferCharacteristics = this.DEFAULTS.transferCharacteristics;
  protected _matrixCoefficients = this.DEFAULTS.matrixCoefficients;
  protected _videoFullRangeFlag = this.DEFAULTS.videoFullRangeFlag;



  constructor(private codecGeneration: VpxCodec) {}

  toString(withoutDefaults = true) {
    if(this._profile === VpxProfile.UNSET || this._bitDepth === VpxBitDepth.UNSET){
      if(this.codecGeneration === VpxCodec.VP8){
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
    if (!profileLimits.bitDepth.includes(this._bitDepth)){
      throw new Error(`Profile ${profile} is not compatible with bit depth ${this._bitDepth}`);
    }
    if (!profileLimits.chromaSubsampling.includes(this._chromaSubsampling)){
      throw new Error(`Profile ${profile} is not compatible with chroma subsampling ${this._chromaSubsampling}`);
    }
    this._profile = profile;
  }

  get bitDepth(): VpxBitDepth {
    return this._bitDepth;
  }
  set bitDepth(bitDepth: VpxBitDepth) {
    const limitations:Record<VpxBitDepth, VpxProfile[]> = {
      [VpxBitDepth.BIT_DEPTH_8]: [VpxProfile.PROFILE_0, VpxProfile.PROFILE_1, VpxProfile.UNSET],
      [VpxBitDepth.BIT_DEPTH_10]: [VpxProfile.PROFILE_2, VpxProfile.PROFILE_3, VpxProfile.UNSET],
      [VpxBitDepth.BIT_DEPTH_12]: [VpxProfile.PROFILE_2, VpxProfile.PROFILE_3, VpxProfile.UNSET],
      [VpxBitDepth.UNSET]: [VpxProfile.UNSET, VpxProfile.PROFILE_0, VpxProfile.PROFILE_1, VpxProfile.PROFILE_2, VpxProfile.PROFILE_3]
    }
    const bitDepthLimits = limitations[bitDepth];
    if(!bitDepthLimits.includes(this._profile)){
      throw new Error(`Bit depth ${bitDepth} is not compatible with profile ${this._profile}`);
    }
    this._bitDepth = bitDepth;
  }

  get chromaSubsampling(): VpxChromaSubsampling {
    return this._chromaSubsampling;
  }
  set chromaSubsampling(chromaSubsampling: VpxChromaSubsampling) {
    const limitations:Record<VpxChromaSubsampling, VpxProfile[]> = {
      [VpxChromaSubsampling.CS_420_COLOCATED_0_0]: [VpxProfile.PROFILE_0, VpxProfile.PROFILE_2, VpxProfile.UNSET],
      [VpxChromaSubsampling.CS_420_VERTICAL]: [VpxProfile.PROFILE_0, VpxProfile.PROFILE_2, VpxProfile.UNSET],
      [VpxChromaSubsampling.CS_422]: [VpxProfile.PROFILE_1, VpxProfile.PROFILE_3, VpxProfile.UNSET],
      [VpxChromaSubsampling.CS_444]: [VpxProfile.PROFILE_1, VpxProfile.PROFILE_3, VpxProfile.UNSET],
      [VpxChromaSubsampling.UNSET]: [VpxProfile.UNSET, VpxProfile.PROFILE_0, VpxProfile.PROFILE_1, VpxProfile.PROFILE_2, VpxProfile.PROFILE_3]
    }
    const chromaSubsamplingLimits = limitations[chromaSubsampling];
    if(!chromaSubsamplingLimits.includes(this._profile)){
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

  get colourPrimaries(): VpxColourPrimaries {
    return this._colourPrimaries;
  }
  set colourPrimaries(colourPrimaries: VpxColourPrimaries) {
    this._colourPrimaries = colourPrimaries;
  }

  get transferCharacteristics(): VpxTransferCharacteristics {
    return this._transferCharacteristics;
  }
  set transferCharacteristics(transferCharacteristics: VpxTransferCharacteristics) {
    this._transferCharacteristics = transferCharacteristics;
  }

  get matrixCoefficients(): VpxMatrixCoefficients {
    return this._matrixCoefficients;
  }
  set matrixCoefficients(matrixCoefficients: VpxMatrixCoefficients) {
    this._matrixCoefficients = matrixCoefficients;
  }

  get videoFullRangeFlag(): VpxVideoFullRangeFlag {
    return this._videoFullRangeFlag;
  }
  set videoFullRangeFlag(videoFullRangeFlag: VpxVideoFullRangeFlag) {
    this._videoFullRangeFlag = videoFullRangeFlag;
  }
}

export class Vp8Info extends VpXInfo {
  constructor() {
    super(VpxCodec.VP8);
  }

  set profile(profile: VpxProfile) {
    if (profile !== VpxProfile.PROFILE_0) {
      throw new Error('VP8 only supports a profile value of 0.');
    }
    super.profile = profile;
  }
  get profile() {
    return this._profile;
  }
}

export class Vp9Info extends VpXInfo {
  constructor() {
    super(VpxCodec.VP9);
  }
}