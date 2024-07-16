import {CodecInfo} from "../codec-info";
import {
  ColourPrimaries, hColourPrimaries,
  hMatrixCoefficients, hTransferCharacteristics, hVideoFullRangeFlag,
  MatrixCoefficients,
  TransferCharacteristics,
  VideoFullRangeFlag,
} from "../iso-23001-8_2016";
import {
  Av1BitDepth,
  Av1ChromaSamplePosition,
  Av1Level,
  Av1Profile,
  Av1Tier,
  hTier,
  hProfile,
  hLevel,
  hChromaSamplePosition
} from "./enums";
import {padStart} from "../pad-start";

//https://aomediacodec.github.io/av1-spec/av1-spec.pdf#page=2
export class Av1Info extends CodecInfo {

  codecName = 'av1';

  private _profile: Av1Profile = Av1Profile.UNSET;
  private _level: Av1Level = Av1Level.UNSET;
  private _tier: Av1Tier = Av1Tier.UNSET;
  private _bitDepth: Av1BitDepth = Av1BitDepth.UNSET;
  private _monochrome: boolean = false;
  private _chromaSubsamplingX: boolean = false;
  private _chromaSubsamplingY: boolean = false;
  private _chromaSamplePosition: Av1ChromaSamplePosition = Av1ChromaSamplePosition.UNKNOWN;
  private _colorPrimaries: ColourPrimaries = ColourPrimaries.UNSPECIFIED
  private _transferCharacteristics: TransferCharacteristics = TransferCharacteristics.UNSPECIFIED
  private _matrixCoefficients: MatrixCoefficients = MatrixCoefficients.UNSPECIFIED
  private _videoFullRangeFlag: VideoFullRangeFlag = VideoFullRangeFlag.LEGAL

  constructor() {
    super();
  }

  get profile(): Av1Profile {
    return this._profile;
  }
  set profile(profile: Av1Profile) {
    this._profile = profile;
  }

  get level(): Av1Level {
    return this._level;
  }
  set level(level: Av1Level) {
    this._level = level;
  }
  get tier(): Av1Tier {
    return this._tier;
  }
  set tier(tier: Av1Tier) {
    this._tier = tier;
  }
  get bitDepth(): Av1BitDepth {
    return this._bitDepth;
  }
  set bitDepth(bitDepth: Av1BitDepth) {
    this._bitDepth = bitDepth;
  }
  get monochrome(): boolean {
    return this._monochrome;
  }
  set monochrome(monochrome: boolean) {
    this._monochrome = monochrome;
  }

  get chromaSubsampling(): string {
    return `${this._chromaSubsamplingX ? 1 : 0}${this._chromaSubsamplingY ? 1 : 0}${this._chromaSubsamplingX && this._chromaSubsamplingY ? this._chromaSamplePosition : '0'}`;
  }

  set chromaSubsampling(chromaSubsampling: string) {
    this._chromaSubsamplingX = chromaSubsampling[0] === '1';
    this._chromaSubsamplingY = chromaSubsampling[1] === '1';
    if (this._chromaSubsamplingX && this._chromaSubsamplingY) {
      this._chromaSamplePosition = parseInt(chromaSubsampling[2]) as Av1ChromaSamplePosition;
    }
  }
  get colorPrimaries(): ColourPrimaries {
    return this._colorPrimaries;
  }
  set colorPrimaries(colorPrimaries: ColourPrimaries) {
    this._colorPrimaries = colorPrimaries;
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

  toString(): string {
    const isoParts = [];
    //<sample entry 4CC>.<profile>.<level><tier>.<bitDepth>.<monochrome>.<chromaSubsampling>.
    // <colorPrimaries>.<transferCharacteristics>.<matrixCoefficients>.<videoFullRangeFlag>
    isoParts.push(this._videoFullRangeFlag);
    isoParts.push(this._matrixCoefficients);
    isoParts.push(this._transferCharacteristics);
    isoParts.push(this._colorPrimaries);
    isoParts.push(this.chromaSubsampling);
    isoParts.push(this._monochrome ? '1' : '0');
    isoParts.push(this._bitDepth.toString());
    isoParts.push(this._level.toString() + this._tier.toString());
    isoParts.push(this._profile);
    isoParts.push('av01');
    return isoParts
      .reverse()
      .map(record => padStart(record.toString(), 2, '0'))
      .join('.');
  }
  static fromString(codecString: string): Av1Info {
    const box = codecString.split('.');
    const info = new Av1Info();
    //<sample entry 4CC>.<profile>.<level><tier>.<bitDepth>.<monochrome>.<chromaSubsampling>.
    // <colorPrimaries>.<transferCharacteristics>.<matrixCoefficients>.<videoFullRangeFlag>
    if (box[1]) {
      info.profile = parseInt(box[1]) as Av1Profile;
    }
    if(box[2]) {
      const levelTier = box[2];
      info.tier = levelTier[levelTier.length - 1] as Av1Tier;
      info.level = parseInt(levelTier.substring(0, levelTier.length - 1)) as Av1Level;
    }
    if (box[3]) {
      info.bitDepth = parseInt(box[3]) as Av1BitDepth;
    }
    if (box[4]) {
      info.monochrome = box[4] === '1';
    }
    if (box[5]) {
      info.chromaSubsampling = box[5];
    }
    if (box[6]) {
      info.colorPrimaries = parseInt(box[6]) as ColourPrimaries;
    }
    if (box[7]) {
      info.transferCharacteristics = parseInt(box[7]) as TransferCharacteristics;
    }
    if (box[8]) {
      info.matrixCoefficients = parseInt(box[8]) as MatrixCoefficients;
    }
    if (box[9]) {
      info.videoFullRangeFlag = parseInt(box[9]) as VideoFullRangeFlag;
    }
    
    return info;

  }
  
  toHumanReadable(){
    return {
      profile: hProfile(this._profile),
      level: hLevel(this._level),
      tier: hTier(this.tier),
      bitDepth: this._bitDepth === -1?'unknown':this._bitDepth.toString(),
      monochrome:this._monochrome,
      chromaSubsamplingX: this._chromaSubsamplingX,
      chromaSubsamplingY: this._chromaSubsamplingY,
      chromaSamplePosition: hChromaSamplePosition(this._chromaSamplePosition),
      colourPrimaries: hColourPrimaries(this._colorPrimaries),
      transferCharacteristics: hTransferCharacteristics(this._transferCharacteristics),
      matrixCoefficients: hMatrixCoefficients(this.matrixCoefficients),
      videoFullRangeFlag: hVideoFullRangeFlag(this._videoFullRangeFlag),
    } as const;
  }
}