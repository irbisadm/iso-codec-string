import {CodecInfo} from "../codec-info";
import {padStart} from "../pad-start";
import {AVS2_AUDIO_FOUR_CCS, Avs2AudioFourCC, hAudioCodec} from "./enums";

function assertByte(value: number, name: string): number {
  if (!Number.isInteger(value) || value < 0 || value > 255) {
    throw new Error(`${name} must be a byte in the range 0-255`);
  }
  return value;
}

// AVS2 audio codec information. Codec string: cavs.<audio_codec_id> (one hex byte).
export class Avs2AudioInfo extends CodecInfo {
  codecName = 'cavs';

  private _fourCC: Avs2AudioFourCC = 'cavs';
  private _audioCodecId = 0;

  get fourCC(): Avs2AudioFourCC {
    return this._fourCC;
  }

  set fourCC(fourCC: Avs2AudioFourCC) {
    if (!AVS2_AUDIO_FOUR_CCS.includes(fourCC)) {
      throw new Error(`Invalid AVS2 audio sample entry: ${fourCC}`);
    }
    this._fourCC = fourCC;
  }

  get audioCodecId(): number {
    return this._audioCodecId;
  }

  set audioCodecId(audioCodecId: number) {
    this._audioCodecId = assertByte(audioCodecId, 'audio_codec_id');
  }

  static fromString(codecString: string): Avs2AudioInfo {
    const parts = codecString.split('.');
    const fourCC = parts[0] as Avs2AudioFourCC;
    if (!AVS2_AUDIO_FOUR_CCS.includes(fourCC)) {
      throw new Error('Unknown codec');
    }
    if (parts.length !== 2 || !/^[0-9a-fA-F]{1,2}$/.test(parts[1])) {
      throw new Error('Invalid AVS2 audio codec string, expected cavs.<audio_codec_id>');
    }
    const info = new Avs2AudioInfo();
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
