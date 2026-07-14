import {CodecInfo} from "../codec-info";
import {padStart} from "../pad-start";
import {MP4_FOUR_CCS, Mp4FourCC, hAudioObjectType, hObjectTypeIndication} from "./enums";

// MP4 (mp4a / mp4v) codec information based on the RFC 6381 ObjectTypeIndication scheme.
// Codec string: <fourCC>.<OTI>[.<detail>] — OTI two hex digits, optional decimal detail
// (audio object type for mp4a.40, video profile-level for mp4v.20).
export class Mp4Info extends CodecInfo {
  codecName = 'mp4a';

  private _fourCC: Mp4FourCC = 'mp4a';
  private _objectTypeIndication = 0;
  private _objectType: number | undefined = undefined;

  get fourCC(): Mp4FourCC {
    return this._fourCC;
  }

  set fourCC(fourCC: Mp4FourCC) {
    if (!MP4_FOUR_CCS.includes(fourCC)) {
      throw new Error(`Invalid MP4 sample entry: ${fourCC}`);
    }
    this._fourCC = fourCC;
    this.codecName = fourCC;
  }

  get objectTypeIndication(): number {
    return this._objectTypeIndication;
  }

  set objectTypeIndication(objectTypeIndication: number) {
    if (!Number.isInteger(objectTypeIndication) || objectTypeIndication < 0 || objectTypeIndication > 255) {
      throw new Error('objectTypeIndication must be a byte in the range 0-255');
    }
    this._objectTypeIndication = objectTypeIndication;
  }

  // The optional third element: audio object type (mp4a.40) or video profile-level (mp4v.20).
  get objectType(): number | undefined {
    return this._objectType;
  }

  set objectType(objectType: number | undefined) {
    if (objectType !== undefined && (!Number.isInteger(objectType) || objectType < 0)) {
      throw new Error('objectType must be a non-negative integer');
    }
    this._objectType = objectType;
  }

  static fromString(codecString: string): Mp4Info {
    const parts = codecString.split('.');
    const fourCC = parts[0] as Mp4FourCC;
    if (!MP4_FOUR_CCS.includes(fourCC)) {
      throw new Error('Unknown codec');
    }
    if (parts.length < 2 || parts.length > 3) {
      throw new Error('Invalid MP4 codec string, expected <fourCC>.<OTI>[.<detail>]');
    }
    if (!/^[0-9a-fA-F]{2}$/.test(parts[1])) {
      throw new Error('Invalid MP4 object type indication, expected two hex digits');
    }
    const info = new Mp4Info();
    info.fourCC = fourCC;
    info.objectTypeIndication = parseInt(parts[1], 16);
    if (parts[2] !== undefined) {
      if (!/^\d+$/.test(parts[2])) {
        throw new Error('Invalid MP4 codec string detail, expected a decimal number');
      }
      info.objectType = parseInt(parts[2], 10);
    }
    return info;
  }

  toString(): string {
    const oti = padStart(this._objectTypeIndication.toString(16).toUpperCase(), 2, '0');
    const detail = this._objectType !== undefined ? `.${this._objectType}` : '';
    return `${this._fourCC}.${oti}${detail}`;
  }

  toHumanReadable() {
    let detail = 'none';
    if (this._objectType !== undefined) {
      detail = this._fourCC === 'mp4a' && this._objectTypeIndication === 0x40
        ? hAudioObjectType(this._objectType)
        : String(this._objectType);
    }
    return {
      fourCC: this._fourCC,
      codec: hObjectTypeIndication(this._objectTypeIndication),
      objectTypeIndication: this._objectTypeIndication,
      detail,
    } as const;
  }
}
