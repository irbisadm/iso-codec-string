import {CodecInfo} from "../codec-info";
import {LCEVC_FOUR_CCS, LcevcFourCC, hLevel, hProfile} from "./enums";

function assertRange(value: number, min: number, max: number, name: string): number {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer in the range ${min}-${max}`);
  }
  return value;
}

// LCEVC codec information. Codec string: lvc1.vprf<profile_idc>.vlev<level_idc>.
export class LcevcInfo extends CodecInfo {
  codecName = 'lcevc';

  private _fourCC: LcevcFourCC = 'lvc1';
  private _profileIdc = 0;
  private _levelIdc = 0;

  get fourCC(): LcevcFourCC {
    return this._fourCC;
  }

  set fourCC(fourCC: LcevcFourCC) {
    if (!LCEVC_FOUR_CCS.includes(fourCC)) {
      throw new Error(`Invalid LCEVC sample entry: ${fourCC}`);
    }
    this._fourCC = fourCC;
  }

  get profileIdc(): number {
    return this._profileIdc;
  }

  set profileIdc(profileIdc: number) {
    this._profileIdc = assertRange(profileIdc, 0, 255, 'vprf (profile_idc)');
  }

  get levelIdc(): number {
    return this._levelIdc;
  }

  set levelIdc(levelIdc: number) {
    this._levelIdc = assertRange(levelIdc, 0, 255, 'vlev (level_idc)');
  }

  static fromString(codecString: string): LcevcInfo {
    const parts = codecString.split('.');
    const fourCC = parts[0] as LcevcFourCC;
    if (!LCEVC_FOUR_CCS.includes(fourCC)) {
      throw new Error('Unknown codec');
    }
    const info = new LcevcInfo();
    info.fourCC = fourCC;

    let hasProfile = false;
    let hasLevel = false;
    for (const segment of parts.slice(1)) {
      const key = segment.slice(0, 4).toLowerCase();
      const value = segment.slice(4);
      if (!/^\d+$/.test(value)) {
        throw new Error(`Invalid LCEVC parameter value: ${segment}`);
      }
      if (key === 'vprf') {
        info.profileIdc = parseInt(value, 10);
        hasProfile = true;
      } else if (key === 'vlev') {
        info.levelIdc = parseInt(value, 10);
        hasLevel = true;
      } else {
        throw new Error(`Unknown LCEVC parameter: ${key}`);
      }
    }
    if (!hasProfile || !hasLevel) {
      throw new Error('Invalid LCEVC codec string, expected lvc1.vprf<profile>.vlev<level>');
    }
    return info;
  }

  toString(): string {
    return `${this._fourCC}.vprf${this._profileIdc}.vlev${this._levelIdc}`;
  }

  toHumanReadable() {
    return {
      fourCC: this._fourCC,
      profile: hProfile(this._profileIdc),
      profileIdc: this._profileIdc,
      level: hLevel(this._levelIdc),
      levelIdc: this._levelIdc,
    } as const;
  }
}
