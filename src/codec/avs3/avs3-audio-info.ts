import {CodecInfo} from "../codec-info";
import {padStart} from "../pad-start";
import {AVS3_AUDIO_FOUR_CCS, Avs3AudioFourCC, hAudioCodec} from "./enums";

function assertByte(value: number, name: string): number {
  if (!Number.isInteger(value) || value < 0 || value > 255) {
    throw new Error(`${name} must be a byte in the range 0-255`);
  }
  return value;
}

// AVS3 audio codec information. Codec string: av3a.<audio_codec_id> (one hex byte).
export class Avs3AudioInfo extends CodecInfo {
  codecName = 'av3a';

  private _fourCC: Avs3AudioFourCC = 'av3a';
  private _audioCodecId = 0;

  get fourCC(): Avs3AudioFourCC {
    return this._fourCC;
  }

  set fourCC(fourCC: Avs3AudioFourCC) {
    if (!AVS3_AUDIO_FOUR_CCS.includes(fourCC)) {
      throw new Error(`Invalid AVS3 audio sample entry: ${fourCC}`);
    }
    this._fourCC = fourCC;
  }

  get audioCodecId(): number {
    return this._audioCodecId;
  }

  set audioCodecId(audioCodecId: number) {
    this._audioCodecId = assertByte(audioCodecId, 'audio_codec_id');
  }

  static fromString(codecString: string): Avs3AudioInfo {
    const parts = codecString.split('.');
    const fourCC = parts[0] as Avs3AudioFourCC;
    if (!AVS3_AUDIO_FOUR_CCS.includes(fourCC)) {
      throw new Error('Unknown codec');
    }
    if (parts.length !== 2 || !/^[0-9a-fA-F]{1,2}$/.test(parts[1])) {
      throw new Error('Invalid AVS3 audio codec string, expected av3a.<audio_codec_id>');
    }
    const info = new Avs3AudioInfo();
    info.fourCC = fourCC;
    info.audioCodecId = parseInt(parts[1], 16);
    return info;
  }

  toString(): string {
    return `${this._fourCC}.${padStart(this._audioCodecId.toString(16), 2, '0')}`;
  }

  toHumanReadable() {
    return {
      fourCC: this._fourCC,
      codec: hAudioCodec(this._audioCodecId),
      audioCodecId: this._audioCodecId,
    } as const;
  }
}
