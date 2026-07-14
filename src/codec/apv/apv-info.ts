import {CodecInfo} from "../codec-info";
import {APV_FOUR_CCS, ApvFourCC, hLevel, hProfile} from "./enums";

function assertRange(value: number, min: number, max: number, name: string): number {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer in the range ${min}-${max}`);
  }
  return value;
}

// APV codec information. Codec string: apv1.apvf<profile_idc>.apvl<level_idc>.apvb<band_idc>.
export class ApvInfo extends CodecInfo {
  codecName = 'apv';

  private _fourCC: ApvFourCC = 'apv1';
  private _profileIdc = 0;
  private _levelIdc = 0;
  private _bandIdc = 0;

  get fourCC(): ApvFourCC {
    return this._fourCC;
  }

  set fourCC(fourCC: ApvFourCC) {
    if (!APV_FOUR_CCS.includes(fourCC)) {
      throw new Error(`Invalid APV sample entry: ${fourCC}`);
    }
    this._fourCC = fourCC;
  }

  get profileIdc(): number {
    return this._profileIdc;
  }

  set profileIdc(profileIdc: number) {
    this._profileIdc = assertRange(profileIdc, 0, 255, 'apvf (profile_idc)');
  }

  get levelIdc(): number {
    return this._levelIdc;
  }

  set levelIdc(levelIdc: number) {
    this._levelIdc = assertRange(levelIdc, 0, 255, 'apvl (level_idc)');
  }

  get bandIdc(): number {
    return this._bandIdc;
  }

  set bandIdc(bandIdc: number) {
    this._bandIdc = assertRange(bandIdc, 0, 255, 'apvb (band_idc)');
  }

  static fromString(codecString: string): ApvInfo {
    const parts = codecString.split('.');
    const fourCC = parts[0] as ApvFourCC;
    if (!APV_FOUR_CCS.includes(fourCC)) {
      throw new Error('Unknown codec');
    }
    const info = new ApvInfo();
    info.fourCC = fourCC;

    const seen = {apvf: false, apvl: false, apvb: false};
    for (const segment of parts.slice(1)) {
      const key = segment.slice(0, 4).toLowerCase();
      const value = segment.slice(4);
      if (!/^\d+$/.test(value)) {
        throw new Error(`Invalid APV parameter value: ${segment}`);
      }
      if (key === 'apvf') {
        info.profileIdc = parseInt(value, 10);
        seen.apvf = true;
      } else if (key === 'apvl') {
        info.levelIdc = parseInt(value, 10);
        seen.apvl = true;
      } else if (key === 'apvb') {
        info.bandIdc = parseInt(value, 10);
        seen.apvb = true;
      } else {
        throw new Error(`Unknown APV parameter: ${key}`);
      }
    }
    if (!seen.apvf || !seen.apvl || !seen.apvb) {
      throw new Error('Invalid APV codec string, expected apv1.apvf<profile>.apvl<level>.apvb<band>');
    }
    return info;
  }

  toString(): string {
    return `${this._fourCC}.apvf${this._profileIdc}.apvl${this._levelIdc}.apvb${this._bandIdc}`;
  }

  toHumanReadable() {
    return {
      fourCC: this._fourCC,
      profile: hProfile(this._profileIdc),
      profileIdc: this._profileIdc,
      level: hLevel(this._levelIdc),
      levelIdc: this._levelIdc,
      band: this._bandIdc,
    } as const;
  }
}
