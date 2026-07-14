import {CodecInfo} from "../codec-info";
import {padStart} from "../pad-start";
import {MPEGH_FOUR_CCS, MpeghFourCC, hProfileLevel} from "./enums";

// MPEG-H 3D Audio codec information. Codec string: <fourCC>.<profileLevelId> (one hex byte).
export class MpeghInfo extends CodecInfo {
  codecName = 'mpegh';

  private _fourCC: MpeghFourCC = 'mhm1';
  private _profileLevelId = 0;

  get fourCC(): MpeghFourCC {
    return this._fourCC;
  }

  set fourCC(fourCC: MpeghFourCC) {
    if (!MPEGH_FOUR_CCS.includes(fourCC)) {
      throw new Error(`Invalid MPEG-H sample entry: ${fourCC}`);
    }
    this._fourCC = fourCC;
  }

  get profileLevelId(): number {
    return this._profileLevelId;
  }

  set profileLevelId(profileLevelId: number) {
    if (!Number.isInteger(profileLevelId) || profileLevelId < 0 || profileLevelId > 255) {
      throw new Error('mpegh3daProfileLevelIndication must be a byte in the range 0-255');
    }
    this._profileLevelId = profileLevelId;
  }

  static fromString(codecString: string): MpeghInfo {
    const parts = codecString.split('.');
    const fourCC = parts[0] as MpeghFourCC;
    if (!MPEGH_FOUR_CCS.includes(fourCC)) {
      throw new Error('Unknown codec');
    }
    if (parts.length !== 2 || !/^[0-9a-fA-F]{1,2}$/.test(parts[1])) {
      throw new Error('Invalid MPEG-H codec string, expected <fourCC>.<profileLevelId>');
    }
    const info = new MpeghInfo();
    info.fourCC = fourCC;
    info.profileLevelId = parseInt(parts[1], 16);
    return info;
  }

  toString(): string {
    return `${this._fourCC}.${padStart(this._profileLevelId.toString(16), 2, '0')}`;
  }

  toHumanReadable() {
    return {
      fourCC: this._fourCC,
      profileLevel: hProfileLevel(this._profileLevelId),
      profileLevelId: this._profileLevelId,
    } as const;
  }
}
