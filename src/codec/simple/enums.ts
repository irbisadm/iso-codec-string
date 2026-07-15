// Parameterless codecs: the codecs= string is just the sample-entry 4CC, with no dot-separated
// parameters to parse. Each recognised 4CC maps to a human-readable name.

export const SIMPLE_CODECS: Readonly<Record<string, string>> = {
  // DTS / DTS-HD / DTS:X (a separate company, not Dolby)
  'dtsc': 'DTS-HD Core',
  'dtse': 'DTS Express',
  'dtsh': 'DTS-HD (with core)',
  'dtsl': 'DTS-HD Lossless',
  'dtsx': 'DTS:X (Profile 2)',
  'dtsy': 'DTS:X (Profile 3)',
  // VC-1
  'vc-1': 'SMPTE VC-1',
  // Lossy / lossless audio
  'opus': 'Opus',
  'flac': 'FLAC',
  'vorbis': 'Vorbis',
  'alac': 'Apple Lossless (ALAC)',
  // WebVTT subtitles (parameterless; TTML/stpp is handled separately as it carries a profile)
  'wvtt': 'WebVTT',
  // Other text / caption sample entries
  'tx3g': '3GPP Timed Text',
  'c608': 'CEA-608 Closed Captions',
  'c708': 'CEA-708 Closed Captions',
  // 3GPP mobile audio and DRA
  'samr': 'AMR (narrow-band)',
  'sawb': 'AMR-WB (wide-band)',
  'dra1': 'DRA Audio',
  // PCM variants
  'ipcm': 'Uncompressed PCM',
  'fpcm': 'Floating-point PCM',
  'twos': 'PCM (big-endian)',
  'sowt': 'PCM (little-endian)',
  'lpcm': 'Linear PCM',
  'in24': 'PCM 24-bit',
  'in32': 'PCM 32-bit',
  'fl32': 'PCM 32-bit float',
  'fl64': 'PCM 64-bit float',
};

export function isSimpleCodec(codecString: string): boolean {
  return codecString.toLowerCase() in SIMPLE_CODECS;
}

export function hSimpleCodec(fourCC: string): string {
  return SIMPLE_CODECS[fourCC.toLowerCase()] ?? 'unknown';
}
