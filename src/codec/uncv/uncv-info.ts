import {CodecInfo} from "../codec-info";
import {UNCV_FOUR_CCS, UncvFourCC, hProfile} from "./enums";

// Uncompressed video/image codec information. Codec string: <fourCC>[.<profile 4CC>].
export class UncvInfo extends CodecInfo {
  codecName = 'uncv';

  private _fourCC: UncvFourCC = 'uncv';
  private _profile: string | undefined = undefined;

  get fourCC(): UncvFourCC {
    return this._fourCC;
  }

  set fourCC(fourCC: UncvFourCC) {
    if (!UNCV_FOUR_CCS.includes(fourCC)) {
      throw new Error(`Invalid uncompressed sample entry: ${fourCC}`);
    }
    this._fourCC = fourCC;
    this.codecName = fourCC;
  }

  // The uncompressed-video profile 4CC (e.g. "rgba"), or undefined for the generic form.
  get profile(): string | undefined {
    return this._profile;
  }

  set profile(profile: string | undefined) {
    if (profile !== undefined && !/^[0-9a-zA-Z]{4}$/.test(profile)) {
      throw new Error('uncv profile must be a four-character code');
    }
    this._profile = profile;
  }

  static fromString(codecString: string): UncvInfo {
    const parts = codecString.split('.');
    const fourCC = parts[0] as UncvFourCC;
    if (!UNCV_FOUR_CCS.includes(fourCC)) {
      throw new Error('Unknown codec');
    }
    if (parts.length > 2) {
      throw new Error('Invalid uncv codec string, expected <fourCC>[.<profile>]');
    }
    const info = new UncvInfo();
    info.fourCC = fourCC;
    if (parts[1] !== undefined) {
      if (!/^[0-9a-zA-Z]{4}$/.test(parts[1])) {
        throw new Error('Invalid uncv profile, expected a four-character code');
      }
      info.profile = parts[1];
    }
    return info;
  }

  toString(): string {
    return this._profile !== undefined ? `${this._fourCC}.${this._profile}` : this._fourCC;
  }

  toHumanReadable() {
    return {
      fourCC: this._fourCC,
      profile: this._profile ?? 'none',
      format: this._profile !== undefined ? hProfile(this._profile) : 'generic',
    } as const;
  }
}
