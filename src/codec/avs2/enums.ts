// AVS2 audio (China AVS working group). Codec string: cavs.<audio_codec_id> (one hex byte).
// e.g. cavs.00 (General Audio Coding), cavs.01 (Lossless Audio Coding).

export type Avs2AudioFourCC = 'cavs';
export const AVS2_AUDIO_FOUR_CCS: readonly Avs2AudioFourCC[] = ['cavs'];

export function hAudioCodec(audioCodecId: number): string {
  switch (audioCodecId) {
    case 0x00: return 'General Audio Coding';
    case 0x01: return 'Lossless Audio Coding';
    default: return 'unknown';
  }
}
