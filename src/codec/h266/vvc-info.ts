import {CodecInfo} from "../codec-info";
import {VVC_FOUR_CCS, VvcFourCC, hLevel, hProfile, hTier} from "./enums";

function assertRange(value: number, min: number, max: number, name: string): number {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer in the range ${min}-${max}`);
  }
  return value;
}

// H.266 / VVC codec information.
// Codec string: <fourCC>.<general_profile_idc>.<L|H general_level_idc>[.<optional fields>].
// The profile/tier/level part is fully decoded; the optional C/S/O fields are preserved verbatim.
export class H266Info extends CodecInfo {
  codecName = 'h266';

  private _fourCC: VvcFourCC = 'vvc1';
  private _profileIdc = 0;
  private _tierFlag = 0;
  private _levelIdc = 0;
  private _optionalParams: string[] = [];

  get fourCC(): VvcFourCC {
    return this._fourCC;
  }

  set fourCC(fourCC: VvcFourCC) {
    if (!VVC_FOUR_CCS.includes(fourCC)) {
      throw new Error(`Invalid VVC sample entry: ${fourCC}`);
    }
    this._fourCC = fourCC;
  }

  get profileIdc(): number {
    return this._profileIdc;
  }

  set profileIdc(profileIdc: number) {
    this._profileIdc = assertRange(profileIdc, 0, 127, 'general_profile_idc');
  }

  get tierFlag(): number {
    return this._tierFlag;
  }

  set tierFlag(tierFlag: number) {
    this._tierFlag = assertRange(tierFlag, 0, 1, 'general_tier_flag');
  }

  get levelIdc(): number {
    return this._levelIdc;
  }

  set levelIdc(levelIdc: number) {
    this._levelIdc = assertRange(levelIdc, 0, 255, 'general_level_idc');
  }

  // Optional constraint (C), sub-profile (S) and output-layer-set (O) fields, preserved verbatim.
  get optionalParams(): string[] {
    return [...this._optionalParams];
  }

  set optionalParams(optionalParams: string[]) {
    optionalParams.forEach((segment) => {
      if (!segment) {
        throw new Error('VVC optional field must not be empty');
      }
    });
    this._optionalParams = [...optionalParams];
  }

  static fromString(codecString: string): H266Info {
    const parts = codecString.split('.');
    const fourCC = parts[0] as VvcFourCC;
    if (!VVC_FOUR_CCS.includes(fourCC)) {
      throw new Error('Unknown codec');
    }
    if (parts.length < 3) {
      throw new Error('Invalid VVC codec string, expected <fourCC>.<profile>.<tier+level>[.fields]');
    }
    const info = new H266Info();
    info.fourCC = fourCC;

    if (!/^\d+$/.test(parts[1])) {
      throw new Error('Invalid VVC profile component');
    }
    info.profileIdc = parseInt(parts[1], 10);

    const tierMatch = parts[2].match(/^([LH])(\d+)$/);
    if (!tierMatch) {
      throw new Error('Invalid VVC tier/level component');
    }
    info.tierFlag = tierMatch[1] === 'H' ? 1 : 0;
    info.levelIdc = parseInt(tierMatch[2], 10);

    info.optionalParams = parts.slice(3);
    return info;
  }

  toString(): string {
    const tierLevel = `${this._tierFlag ? 'H' : 'L'}${this._levelIdc}`;
    return [this._fourCC, String(this._profileIdc), tierLevel, ...this._optionalParams].join('.');
  }

  toHumanReadable() {
    return {
      fourCC: this._fourCC,
      profile: hProfile(this._profileIdc),
      profileIdc: this._profileIdc,
      tier: hTier(this._tierFlag),
      level: hLevel(this._levelIdc),
      levelIdc: this._levelIdc,
      optionalParams: this._optionalParams.length ? this._optionalParams.join('.') : 'none',
    } as const;
  }
}
