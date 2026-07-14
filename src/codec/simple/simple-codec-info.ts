import {CodecInfo} from "../codec-info";
import {SIMPLE_CODECS, hSimpleCodec} from "./enums";

// A parameterless codec (Opus, FLAC, Vorbis, ALAC, PCM variants, DTS, VC-1): the codec string is
// exactly the 4CC, with nothing to parse beyond recognising it.
export class SimpleCodecInfo extends CodecInfo {
  codecName = 'unk';

  private _fourCC = '';

  get fourCC(): string {
    return this._fourCC;
  }

  set fourCC(fourCC: string) {
    if (!(fourCC.toLowerCase() in SIMPLE_CODECS)) {
      throw new Error(`Unknown codec: ${fourCC}`);
    }
    this._fourCC = fourCC;
    this.codecName = fourCC.toLowerCase();
  }

  static fromString(codecString: string): SimpleCodecInfo {
    if (codecString.includes('.')) {
      throw new Error(`Unknown codec: ${codecString}`);
    }
    const info = new SimpleCodecInfo();
    info.fourCC = codecString;
    return info;
  }

  toString(): string {
    return this._fourCC;
  }

  toHumanReadable() {
    return {
      fourCC: this._fourCC,
      codec: hSimpleCodec(this._fourCC),
    } as const;
  }
}
