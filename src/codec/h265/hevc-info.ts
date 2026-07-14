import {CodecInfo} from "../codec-info";
import {padStart} from "../pad-start";
import {HEVC_FOUR_CCS, HevcFourCC, hLevel, hProfile, hTier} from "./enums";

function assertRange(value: number, min: number, max: number, name: string): number {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer in the range ${min}-${max}`);
  }
  return value;
}

function trimTrailingZeros(bytes: number[]): number[] {
  const out = [...bytes];
  while (out.length > 0 && out[out.length - 1] === 0) {
    out.pop();
  }
  return out;
}

// H.265 / HEVC codec information.
// Codec string (RFC 6381): <fourCC>.<space?profile_idc>.<compat_hex>.<L|H level_idc>[.<constraint bytes>].
export class H265Info extends CodecInfo {
  codecName = 'h265';

  private _fourCC: HevcFourCC = 'hvc1';
  private _profileSpace = 0;
  private _profileIdc = 0;
  private _compatibilityFlags = 0;
  private _tierFlag = 0;
  private _levelIdc = 0;
  private _constraintFlags: number[] = [];

  get fourCC(): HevcFourCC {
    return this._fourCC;
  }

  set fourCC(fourCC: HevcFourCC) {
    if (!HEVC_FOUR_CCS.includes(fourCC)) {
      throw new Error(`Invalid HEVC sample entry: ${fourCC}`);
    }
    this._fourCC = fourCC;
  }

  get profileSpace(): number {
    return this._profileSpace;
  }

  set profileSpace(profileSpace: number) {
    this._profileSpace = assertRange(profileSpace, 0, 3, 'general_profile_space');
  }

  get profileIdc(): number {
    return this._profileIdc;
  }

  set profileIdc(profileIdc: number) {
    this._profileIdc = assertRange(profileIdc, 0, 31, 'general_profile_idc');
  }

  get compatibilityFlags(): number {
    return this._compatibilityFlags;
  }

  set compatibilityFlags(compatibilityFlags: number) {
    this._compatibilityFlags = assertRange(compatibilityFlags, 0, 0xffffffff, 'general_profile_compatibility_flags');
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

  get constraintFlags(): number[] {
    return [...this._constraintFlags];
  }

  set constraintFlags(constraintFlags: number[]) {
    if (constraintFlags.length > 6) {
      throw new Error('general_constraint_indicator_flags is at most 6 bytes');
    }
    constraintFlags.forEach((b, i) => assertRange(b, 0, 255, `constraint byte ${i}`));
    this._constraintFlags = [...constraintFlags];
  }

  static fromString(codecString: string): H265Info {
    const parts = codecString.split('.');
    const fourCC = parts[0] as HevcFourCC;
    if (!HEVC_FOUR_CCS.includes(fourCC)) {
      throw new Error('Unknown codec');
    }
    if (parts.length < 4 || parts.length > 10) {
      throw new Error('Invalid HEVC codec string, expected <fourCC>.<profile>.<compat>.<tier+level>[.constraints]');
    }
    const info = new H265Info();
    info.fourCC = fourCC;

    // A: optional profile-space letter (A/B/C = 1/2/3) followed by general_profile_idc.
    const profileMatch = parts[1].match(/^([ABC]?)(\d+)$/);
    if (!profileMatch) {
      throw new Error('Invalid HEVC profile component');
    }
    info.profileSpace = profileMatch[1] ? profileMatch[1].charCodeAt(0) - 64 : 0;
    info.profileIdc = parseInt(profileMatch[2], 10);

    // B: general_profile_compatibility_flags as a 32-bit hex value.
    if (!/^[0-9a-fA-F]{1,8}$/.test(parts[2])) {
      throw new Error('Invalid HEVC compatibility flags');
    }
    info.compatibilityFlags = parseInt(parts[2], 16);

    // C: tier flag (L/H) followed by general_level_idc.
    const tierMatch = parts[3].match(/^([LH])(\d+)$/);
    if (!tierMatch) {
      throw new Error('Invalid HEVC tier/level component');
    }
    info.tierFlag = tierMatch[1] === 'H' ? 1 : 0;
    info.levelIdc = parseInt(tierMatch[2], 10);

    // D: up to six constraint bytes, hex-encoded.
    info.constraintFlags = parts.slice(4).map((byte, i) => {
      if (!/^[0-9a-fA-F]{1,2}$/.test(byte)) {
        throw new Error(`Invalid HEVC constraint byte ${i}`);
      }
      return parseInt(byte, 16);
    });

    return info;
  }

  toString(): string {
    const partA = `${this._profileSpace ? String.fromCharCode(64 + this._profileSpace) : ''}${this._profileIdc}`;
    const partB = this._compatibilityFlags.toString(16).toUpperCase();
    const partC = `${this._tierFlag ? 'H' : 'L'}${this._levelIdc}`;
    const constraints = trimTrailingZeros(this._constraintFlags)
      .map((byte) => padStart(byte.toString(16).toUpperCase(), 2, '0'));
    return [this._fourCC, partA, partB, partC, ...constraints].join('.');
  }

  toHumanReadable() {
    const constraints = trimTrailingZeros(this._constraintFlags)
      .map((byte) => padStart(byte.toString(16).toUpperCase(), 2, '0'));
    return {
      fourCC: this._fourCC,
      profileSpace: this._profileSpace,
      profile: hProfile(this._profileIdc),
      profileIdc: this._profileIdc,
      compatibilityFlags: this._compatibilityFlags.toString(16).toUpperCase(),
      tier: hTier(this._tierFlag),
      level: hLevel(this._levelIdc),
      levelIdc: this._levelIdc,
      constraintFlags: constraints.length ? constraints.join('.') : 'none',
    } as const;
  }
}
