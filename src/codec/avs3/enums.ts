// AVS3 (China AVS working group). Codec strings:
//   avs3.<profile_id>.<level_id>   (video, hex bytes) e.g. avs3.20.10, avs3.32.50
//   av3a.<audio_codec_id>          (audio, hex byte)  e.g. av3a.00

export type Avs3VideoFourCC = 'avs3';
export const AVS3_VIDEO_FOUR_CCS: readonly Avs3VideoFourCC[] = ['avs3'];

export type Avs3AudioFourCC = 'av3a';
export const AVS3_AUDIO_FOUR_CCS: readonly Avs3AudioFourCC[] = ['av3a'];

export function hVideoProfile(profileId: number): string {
  switch (profileId) {
    case 0x20: return 'Main 8-bit';
    case 0x22: return 'Main 10-bit';
    case 0x30: return 'High 8-bit';
    case 0x32: return 'High 10-bit';
    default: return 'unknown';
  }
}

// Only the level_id values with a confirmed mapping are named; others are reported by raw levelId.
export function hVideoLevel(levelId: number): string {
  switch (levelId) {
    case 0x10: return '2.0.15';
    case 0x20: return '4.0.30';
    case 0x50: return '8.0.30';
    default: return 'unknown';
  }
}

export function hAudioCodec(audioCodecId: number): string {
  switch (audioCodecId) {
    case 0x00: return 'General Audio Coding';
    case 0x01: return 'Lossless Audio Coding';
    case 0x02: return 'Full Rate Audio Coding';
    default: return 'unknown';
  }
}
