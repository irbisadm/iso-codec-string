import {CodecInfo} from "../codec-info";
import {H265Info} from "../h265";
import {LHEVC_FOUR_CCS, LhevcFourCC} from "./enums";

// L-HEVC codec information. The profile-tier-level is the HEVC one (reused from H265Info); the
// optional trailing scalability field (".S<mask>") is preserved verbatim.
export class LhevcInfo extends CodecInfo {
  codecName = 'lhevc';

  private _fourCC: LhevcFourCC = 'lhv1';
  private _ptl = new H265Info();
  private _scalability: string[] = [];

  get fourCC(): LhevcFourCC {
    return this._fourCC;
  }

  set fourCC(fourCC: LhevcFourCC) {
    if (!LHEVC_FOUR_CCS.includes(fourCC)) {
      throw new Error(`Invalid L-HEVC sample entry: ${fourCC}`);
    }
    this._fourCC = fourCC;
  }

  // The HEVC profile-tier-level (its internal 4CC is unused; L-HEVC tracks its own fourCC).
  get ptl(): H265Info {
    return this._ptl;
  }

  // Trailing scalability field, e.g. ["SC01"], preserved verbatim.
  get scalability(): string[] {
    return [...this._scalability];
  }

  set scalability(scalability: string[]) {
    if (scalability.length > 0 && !/^S/i.test(scalability[0])) {
      throw new Error('The L-HEVC scalability field must start with "S"');
    }
    scalability.forEach((segment) => {
      if (!segment) {
        throw new Error('L-HEVC scalability segments must not be empty');
      }
    });
    this._scalability = [...scalability];
  }

  static fromString(codecString: string): LhevcInfo {
    const parts = codecString.split('.');
    const fourCC = parts[0] as LhevcFourCC;
    if (!LHEVC_FOUR_CCS.includes(fourCC)) {
      throw new Error('Unknown codec');
    }
    const rest = parts.slice(1);
    // The scalability field (and anything after it) starts with "S"; HEVC PTL segments never do.
    const scalabilityStart = rest.findIndex((segment) => /^S/i.test(segment));
    const ptlSegments = scalabilityStart === -1 ? rest : rest.slice(0, scalabilityStart);
    const scalability = scalabilityStart === -1 ? [] : rest.slice(scalabilityStart);
    if (ptlSegments.length < 3) {
      throw new Error('Invalid L-HEVC codec string, expected <fourCC>.<profile-tier-level>[.S<scalability>]');
    }

    const info = new LhevcInfo();
    info.fourCC = fourCC;
    // Reuse the HEVC profile-tier-level parser (with its validation) via a throwaway hvc1 string.
    info._ptl = H265Info.fromString(`hvc1.${ptlSegments.join('.')}`);
    info.scalability = scalability;
    return info;
  }

  toString(): string {
    const ptlString = this._ptl.toString();
    const ptlParams = ptlString.slice(ptlString.indexOf('.') + 1);
    const scalability = this._scalability.length ? `.${this._scalability.join('.')}` : '';
    return `${this._fourCC}.${ptlParams}${scalability}`;
  }

  toHumanReadable() {
    const ptl = this._ptl.toHumanReadable();
    return {
      fourCC: this._fourCC,
      profile: ptl.profile,
      profileIdc: ptl.profileIdc,
      tier: ptl.tier,
      level: ptl.level,
      levelIdc: ptl.levelIdc,
      scalability: this._scalability.length ? this._scalability.join('.') : 'none',
    } as const;
  }
}
