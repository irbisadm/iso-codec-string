import {CodecInfo} from "../codec-info";
import {hProfile} from "./enums";

// TTML / timed-text (stpp) codec information. Codec string: stpp[.<mode>[.<profile>]].
export class StppInfo extends CodecInfo {
  codecName = 'stpp';

  private _mode: string | undefined = undefined;
  private _profile: string | undefined = undefined;

  // The subtitle mode, e.g. "ttml" (undefined for a bare "stpp").
  get mode(): string | undefined {
    return this._mode;
  }

  set mode(mode: string | undefined) {
    if (mode !== undefined && !/^[a-zA-Z0-9]+$/.test(mode)) {
      throw new Error('stpp mode must be an alphanumeric token');
    }
    this._mode = mode;
    if (mode === undefined) {
      this._profile = undefined;
    }
  }

  // The TTML profile designator, e.g. "im1t" (undefined when absent).
  get profile(): string | undefined {
    return this._profile;
  }

  set profile(profile: string | undefined) {
    if (profile === undefined) {
      this._profile = undefined;
      return;
    }
    if (this._mode === undefined) {
      throw new Error('stpp profile requires a mode (e.g. "ttml") to be set first');
    }
    if (!/^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*$/.test(profile)) {
      throw new Error('stpp profile must be an alphanumeric designator');
    }
    this._profile = profile;
  }

  static fromString(codecString: string): StppInfo {
    const parts = codecString.split('.');
    if (parts[0] !== 'stpp') {
      throw new Error('Unknown codec');
    }
    const info = new StppInfo();
    if (parts[1] !== undefined) {
      if (!/^[a-zA-Z0-9]+$/.test(parts[1])) {
        throw new Error('Invalid stpp mode');
      }
      info.mode = parts[1];
    }
    if (parts.length > 2) {
      info.profile = parts.slice(2).join('.');
    }
    return info;
  }

  toString(): string {
    const parts = ['stpp'];
    if (this._mode !== undefined) parts.push(this._mode);
    if (this._profile !== undefined) parts.push(this._profile);
    return parts.join('.');
  }

  toHumanReadable() {
    return {
      fourCC: 'stpp' as const,
      mode: this._mode ?? 'none',
      profile: this._profile ?? 'none',
      description: hProfile(this._mode, this._profile),
    } as const;
  }
}
