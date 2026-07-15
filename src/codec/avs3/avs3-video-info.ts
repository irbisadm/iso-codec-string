import {CodecInfo} from "../codec-info";
import {padStart} from "../pad-start";
import {AVS3_VIDEO_FOUR_CCS, Avs3VideoFourCC, hVideoLevel, hVideoProfile} from "./enums";

function assertByte(value: number, name: string): number {
  if (!Number.isInteger(value) || value < 0 || value > 255) {
    throw new Error(`${name} must be a byte in the range 0-255`);
  }
  return value;
}

// AVS3 video codec information. Codec string: avs3.<profile_id>.<level_id> (two hex bytes).
export class Avs3VideoInfo extends CodecInfo {
  codecName = 'avs3';

  private _fourCC: Avs3VideoFourCC = 'avs3';
  private _profileId = 0;
  private _levelId = 0;

  get fourCC(): Avs3VideoFourCC {
    return this._fourCC;
  }

  set fourCC(fourCC: Avs3VideoFourCC) {
    if (!AVS3_VIDEO_FOUR_CCS.includes(fourCC)) {
      throw new Error(`Invalid AVS3 video sample entry: ${fourCC}`);
    }
    this._fourCC = fourCC;
    this.codecName = fourCC;
  }

  get profileId(): number {
    return this._profileId;
  }

  set profileId(profileId: number) {
    this._profileId = assertByte(profileId, 'profile_id');
  }

  get levelId(): number {
    return this._levelId;
  }

  set levelId(levelId: number) {
    this._levelId = assertByte(levelId, 'level_id');
  }

  static fromString(codecString: string): Avs3VideoInfo {
    const parts = codecString.split('.');
    const fourCC = parts[0] as Avs3VideoFourCC;
    if (!AVS3_VIDEO_FOUR_CCS.includes(fourCC)) {
      throw new Error('Unknown codec');
    }
    if (parts.length !== 3 || !/^[0-9a-fA-F]{1,2}$/.test(parts[1]) || !/^[0-9a-fA-F]{1,2}$/.test(parts[2])) {
      throw new Error('Invalid AVS3 video codec string, expected avs3.<profile_id>.<level_id>');
    }
    const info = new Avs3VideoInfo();
    info.fourCC = fourCC;
    info.profileId = parseInt(parts[1], 16);
    info.levelId = parseInt(parts[2], 16);
    return info;
  }

  toString(): string {
    const hex = (value: number) => padStart(value.toString(16), 2, '0');
    return `${this._fourCC}.${hex(this._profileId)}.${hex(this._levelId)}`;
  }

  toHumanReadable() {
    return {
      fourCC: this._fourCC,
      profile: hVideoProfile(this._profileId),
      profileId: this._profileId,
      level: hVideoLevel(this._levelId),
      levelId: this._levelId,
    } as const;
  }
}
