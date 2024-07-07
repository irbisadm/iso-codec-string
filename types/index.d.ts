declare enum VpxCodec {
    VP8 = "vp08",
    VP9 = "vp09"
}
declare enum VpxProfile {
    UNSET = -1,
    PROFILE_0 = 0,
    PROFILE_1 = 1,
    PROFILE_2 = 2,
    PROFILE_3 = 3
}
declare enum VpxLevel {
    UNDEFINED = "0",
    LEVEL_1 = "10",
    LEVEL_1_1 = "11",
    LEVEL_2 = "20",
    LEVEL_2_1 = "21",
    LEVEL_3 = "30",
    LEVEL_3_1 = "31",
    LEVEL_4 = "40",
    LEVEL_4_1 = "41",
    LEVEL_5 = "50",
    LEVEL_5_1 = "51",
    LEVEL_5_2 = "52",
    LEVEL_6 = "60",
    LEVEL_6_1 = "61",
    LEVEL_6_2 = "62"
}
declare enum VpxBitDepth {
    UNSET = -1,
    BIT_DEPTH_8 = 8,
    BIT_DEPTH_10 = 10,
    BIT_DEPTH_12 = 12
}
declare enum VpxChromaSubsampling {
    UNSET = -1,
    CS_420_VERTICAL = 0,
    CS_420_COLOCATED_0_0 = 1,
    CS_422 = 2,
    CS_444 = 3
}
declare enum VpxColourPrimaries {
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
    EBU_3213E = 22
}
declare enum VpxTransferCharacteristics {
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
    ARIB_STD_B67 = 18
}
declare enum VpxMatrixCoefficients {
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
    EBU_3213E = 18
}
declare enum VpxVideoFullRangeFlag {
    LEGAL = 0,
    FULL = 1
}
declare abstract class VpXInfo {
    private codecGeneration;
    private DEFAULTS;
    protected _profile: VpxProfile;
    protected _level: VpxLevel;
    protected _bitDepth: VpxBitDepth;
    protected _chromaSubsampling: VpxChromaSubsampling;
    protected _colourPrimaries: VpxColourPrimaries;
    protected _transferCharacteristics: VpxTransferCharacteristics;
    protected _matrixCoefficients: VpxMatrixCoefficients;
    protected _videoFullRangeFlag: VpxVideoFullRangeFlag;
    constructor(codecGeneration: VpxCodec);
    toString(withoutDefaults?: boolean): string;
    get profile(): VpxProfile;
    set profile(profile: VpxProfile);
    get bitDepth(): VpxBitDepth;
    set bitDepth(bitDepth: VpxBitDepth);
    get chromaSubsampling(): VpxChromaSubsampling;
    set chromaSubsampling(chromaSubsampling: VpxChromaSubsampling);
    get level(): VpxLevel;
    set level(level: VpxLevel);
    get colourPrimaries(): VpxColourPrimaries;
    set colourPrimaries(colourPrimaries: VpxColourPrimaries);
    get transferCharacteristics(): VpxTransferCharacteristics;
    set transferCharacteristics(transferCharacteristics: VpxTransferCharacteristics);
    get matrixCoefficients(): VpxMatrixCoefficients;
    set matrixCoefficients(matrixCoefficients: VpxMatrixCoefficients);
    get videoFullRangeFlag(): VpxVideoFullRangeFlag;
    set videoFullRangeFlag(videoFullRangeFlag: VpxVideoFullRangeFlag);
}
declare class Vp8Info extends VpXInfo {
    constructor();
    set profile(profile: VpxProfile);
    get profile(): VpxProfile;
}
declare class Vp9Info extends VpXInfo {
    constructor();
}

type vpx_d_Vp8Info = Vp8Info;
declare const vpx_d_Vp8Info: typeof Vp8Info;
type vpx_d_Vp9Info = Vp9Info;
declare const vpx_d_Vp9Info: typeof Vp9Info;
type vpx_d_VpxBitDepth = VpxBitDepth;
declare const vpx_d_VpxBitDepth: typeof VpxBitDepth;
type vpx_d_VpxChromaSubsampling = VpxChromaSubsampling;
declare const vpx_d_VpxChromaSubsampling: typeof VpxChromaSubsampling;
type vpx_d_VpxColourPrimaries = VpxColourPrimaries;
declare const vpx_d_VpxColourPrimaries: typeof VpxColourPrimaries;
type vpx_d_VpxLevel = VpxLevel;
declare const vpx_d_VpxLevel: typeof VpxLevel;
type vpx_d_VpxMatrixCoefficients = VpxMatrixCoefficients;
declare const vpx_d_VpxMatrixCoefficients: typeof VpxMatrixCoefficients;
type vpx_d_VpxProfile = VpxProfile;
declare const vpx_d_VpxProfile: typeof VpxProfile;
type vpx_d_VpxTransferCharacteristics = VpxTransferCharacteristics;
declare const vpx_d_VpxTransferCharacteristics: typeof VpxTransferCharacteristics;
type vpx_d_VpxVideoFullRangeFlag = VpxVideoFullRangeFlag;
declare const vpx_d_VpxVideoFullRangeFlag: typeof VpxVideoFullRangeFlag;
declare namespace vpx_d {
  export { vpx_d_Vp8Info as Vp8Info, vpx_d_Vp9Info as Vp9Info, vpx_d_VpxBitDepth as VpxBitDepth, vpx_d_VpxChromaSubsampling as VpxChromaSubsampling, vpx_d_VpxColourPrimaries as VpxColourPrimaries, vpx_d_VpxLevel as VpxLevel, vpx_d_VpxMatrixCoefficients as VpxMatrixCoefficients, vpx_d_VpxProfile as VpxProfile, vpx_d_VpxTransferCharacteristics as VpxTransferCharacteristics, vpx_d_VpxVideoFullRangeFlag as VpxVideoFullRangeFlag };
}

declare enum Av1ChromaSamplePosition {
    UNKNOWN = 0,//Unknown (in this case the source video transfer function must be signaled outside the AV1 bitstream)
    VERTICAL = 1,// Horizontally co-located with (0, 0) luma sample, vertical position in the middle between two luma samples
    COLOCATED_WITH_LUMA = 2,// co-located with (0, 0) luma sample
    RESERVED = 3
}
declare enum Av1BitDepth {
    UNSET = -1,
    BIT_DEPTH_8 = 8,
    BIT_DEPTH_10 = 10,
    BIT_DEPTH_12 = 12
}
declare enum Av1Profile {
    UNSET = -1,
    MAIN = 0,
    HIGH = 1,
    PROFESSIONAL = 2
}
declare enum Av1Level {
    UNSET = -1,
    LEVEL_2_0 = 0,
    LEVEL_2_1 = 1,
    LEVEL_2_2 = 2,
    LEVEL_2_3 = 3,
    LEVEL_3_0 = 4,
    LEVEL_3_1 = 5,
    LEVEL_3_2 = 6,
    LEVEL_3_3 = 7,
    LEVEL_4_0 = 8,
    LEVEL_4_1 = 9,
    LEVEL_4_2 = 10,
    LEVEL_4_3 = 11,
    LEVEL_5_0 = 12,
    LEVEL_5_1 = 13,
    LEVEL_5_2 = 14,
    LEVEL_5_3 = 15,
    LEVEL_6_0 = 16,
    LEVEL_6_1 = 17,
    LEVEL_6_2 = 18,
    LEVEL_6_3 = 19,
    LEVEL_7_0 = 20,
    LEVEL_7_1 = 21,
    LEVEL_7_2 = 22,
    LEVEL_7_3 = 23
}
declare enum Av1Tier {
    UNSET = -1,
    MAIN = "M",
    HIGH = "H"
}

declare abstract class CodecInfo {
    codecName: string;
}

declare enum ColourPrimaries {
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
    EBU_3213E = 22
}

declare enum MatrixCoefficients {
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
    EBU_3213E = 18
}

declare enum TransferCharacteristics {
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
    ARIB_STD_B67 = 18
}

declare enum VideoFullRangeFlag {
    LEGAL = 0,
    FULL = 1
}

declare class Av1Info extends CodecInfo {
    codecName: string;
    private _profile;
    private _level;
    private _tier;
    private _bitDepth;
    private _monochrome;
    private _chromaSubsamplingX;
    private _chromaSubsamplingY;
    private _chromaSamplePosition;
    private _colorPrimaries;
    private _transferCharacteristics;
    private _matrixCoefficients;
    private _videoFullRangeFlag;
    constructor();
    get profile(): Av1Profile;
    set profile(profile: Av1Profile);
    get level(): Av1Level;
    set level(level: Av1Level);
    get tier(): Av1Tier;
    set tier(tier: Av1Tier);
    get bitDepth(): Av1BitDepth;
    set bitDepth(bitDepth: Av1BitDepth);
    get monochrome(): boolean;
    set monochrome(monochrome: boolean);
    get chromaSubsampling(): string;
    set chromaSubsampling(chromaSubsampling: string);
    get colorPrimaries(): ColourPrimaries;
    set colorPrimaries(colorPrimaries: ColourPrimaries);
    get transferCharacteristics(): TransferCharacteristics;
    set transferCharacteristics(transferCharacteristics: TransferCharacteristics);
    get matrixCoefficients(): MatrixCoefficients;
    set matrixCoefficients(matrixCoefficients: MatrixCoefficients);
    get videoFullRangeFlag(): VideoFullRangeFlag;
    set videoFullRangeFlag(videoFullRangeFlag: VideoFullRangeFlag);
    toString(): string;
    static fromString(codecString: string): Av1Info;
}

type index_d_Av1BitDepth = Av1BitDepth;
declare const index_d_Av1BitDepth: typeof Av1BitDepth;
type index_d_Av1ChromaSamplePosition = Av1ChromaSamplePosition;
declare const index_d_Av1ChromaSamplePosition: typeof Av1ChromaSamplePosition;
type index_d_Av1Info = Av1Info;
declare const index_d_Av1Info: typeof Av1Info;
type index_d_Av1Level = Av1Level;
declare const index_d_Av1Level: typeof Av1Level;
type index_d_Av1Profile = Av1Profile;
declare const index_d_Av1Profile: typeof Av1Profile;
type index_d_Av1Tier = Av1Tier;
declare const index_d_Av1Tier: typeof Av1Tier;
declare namespace index_d {
  export { index_d_Av1BitDepth as Av1BitDepth, index_d_Av1ChromaSamplePosition as Av1ChromaSamplePosition, index_d_Av1Info as Av1Info, index_d_Av1Level as Av1Level, index_d_Av1Profile as Av1Profile, index_d_Av1Tier as Av1Tier };
}

declare const version = "0.0.4";
declare const codecInfoFactory: (codecString: string) => Vp8Info | Vp9Info | Av1Info;

export { CodecInfo, index_d as av1, codecInfoFactory, version, vpx_d as vpx };
