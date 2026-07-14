import {CodecInfo} from "../codec-info";
import {EVC_FOUR_CCS, EVC_OPTIONAL_KEYS, EvcFourCC, hLevel, hProfile} from "./enums";

function assertRange(value: number, min: number, max: number, name: string): number {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer in the range ${min}-${max}`);
  }
  return value;
}

interface EvcOptionalParam {
  key: string;
  value: string;
}

// vtoh/vtol are hex; the remaining optional parameters are decimal.
function validateOptionalValue(key: string, value: string): void {
  const pattern = key === 'vtoh' || key === 'vtol' ? /^[0-9a-fA-F]+$/ : /^\d+$/;
  if (!pattern.test(value)) {
    throw new Error(`Invalid EVC parameter value: ${key}${value}`);
  }
}

// EVC codec information.
// Codec string: evc1.vprf<profile>.vlev<level>[.<optional key/value params>].
export class EvcInfo extends CodecInfo {
  codecName = 'evc';

  private _fourCC: EvcFourCC = 'evc1';
  private _profileIdc = 0;
  private _levelIdc = 0;
  private _optionalParams: EvcOptionalParam[] = [];

  get fourCC(): EvcFourCC {
    return this._fourCC;
  }

  set fourCC(fourCC: EvcFourCC) {
    if (!EVC_FOUR_CCS.includes(fourCC)) {
      throw new Error(`Invalid EVC sample entry: ${fourCC}`);
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

  // Optional colour / toolset / bit-depth parameters, preserved verbatim.
  get optionalParams(): EvcOptionalParam[] {
    return this._optionalParams.map((param) => ({...param}));
  }

  set optionalParams(optionalParams: EvcOptionalParam[]) {
    optionalParams.forEach(({key, value}) => {
      if (!EVC_OPTIONAL_KEYS.includes(key)) {
        throw new Error(`Unknown EVC parameter: ${key}`);
      }
      validateOptionalValue(key, value);
    });
    this._optionalParams = optionalParams.map((param) => ({...param}));
  }

  static fromString(codecString: string): EvcInfo {
    const parts = codecString.split('.');
    const fourCC = parts[0] as EvcFourCC;
    if (!EVC_FOUR_CCS.includes(fourCC)) {
      throw new Error('Unknown codec');
    }
    const info = new EvcInfo();
    info.fourCC = fourCC;

    let hasProfile = false;
    let hasLevel = false;
    const optionalParams: EvcOptionalParam[] = [];
    for (const segment of parts.slice(1)) {
      const key = segment.slice(0, 4).toLowerCase();
      const value = segment.slice(4);
      if (key === 'vprf') {
        if (!/^\d+$/.test(value)) throw new Error(`Invalid EVC parameter value: ${segment}`);
        info.profileIdc = parseInt(value, 10);
        hasProfile = true;
      } else if (key === 'vlev') {
        if (!/^\d+$/.test(value)) throw new Error(`Invalid EVC parameter value: ${segment}`);
        info.levelIdc = parseInt(value, 10);
        hasLevel = true;
      } else if (EVC_OPTIONAL_KEYS.includes(key)) {
        validateOptionalValue(key, value);
        optionalParams.push({key, value});
      } else {
        throw new Error(`Unknown EVC parameter: ${key}`);
      }
    }
    if (!hasProfile || !hasLevel) {
      throw new Error('Invalid EVC codec string, expected evc1.vprf<profile>.vlev<level>');
    }
    info._optionalParams = optionalParams;
    return info;
  }

  toString(): string {
    const optional = this._optionalParams.map(({key, value}) => `.${key}${value}`).join('');
    return `${this._fourCC}.vprf${this._profileIdc}.vlev${this._levelIdc}${optional}`;
  }

  toHumanReadable() {
    return {
      fourCC: this._fourCC,
      profile: hProfile(this._profileIdc),
      profileIdc: this._profileIdc,
      level: hLevel(this._levelIdc),
      levelIdc: this._levelIdc,
      optionalParams: this._optionalParams.length
        ? this._optionalParams.map(({key, value}) => key + value).join('.')
        : 'none',
    } as const;
  }
}
