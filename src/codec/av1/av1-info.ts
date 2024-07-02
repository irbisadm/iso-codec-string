import {CodecInfo} from "../codec-info";
import {ColourPrimaries, MatrixCoefficients, TransferCharacteristics, VideoFullRangeFlag} from "../iso-23001-8_2016";
import {Av1BitDepth, Av1ChromaSamplePosition, Av1Level, Av1Profile, Av1Tier} from "./enums";

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

  toString(): string {
    const isoParts = [];
    //<sample entry 4CC>.<profile>.<level><tier>.<bitDepth>.<monochrome>.<chromaSubsampling>.
    // <colorPrimaries>.<transferCharacteristics>.<matrixCoefficients>.<videoFullRangeFlag>
    isoParts.push(this.chromaSubsampling);
    isoParts.push(this._monochrome ? '1' : '0');
    isoParts.push(this._bitDepth.toString());
    isoParts.push(this._level.toString() + this._tier.toString());
    isoParts.push(this._profile);
    isoParts.push('av01');
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
}