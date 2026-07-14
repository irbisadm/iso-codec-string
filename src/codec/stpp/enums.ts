// TTML / XML timed-text subtitles, sample entry stpp (ISO/IEC 14496-30). Codec string:
//   stpp[.<mode>[.<profile>]]  e.g. stpp.ttml.im1t (IMSC1 text), stpp.ttml.etx1 (EBU-TT v1.0)
// The only defined mode is "ttml"; the profile is a registered TTML profile designator.

export type StppFourCC = 'stpp';
export const STPP_FOUR_CCS: readonly StppFourCC[] = ['stpp'];

const STPP_TTML_PROFILES: Readonly<Record<string, string>> = {
  'im1t': 'IMSC1 text',
  'im1i': 'IMSC1 image',
  'im2t': 'IMSC2 text',
  'im2i': 'IMSC2 image',
  'tt1f': 'TTML1 full',
  'tt1p': 'TTML1 presentation',
  'tt1s': 'TTML1 simple delivery (US closed captions)',
  'tt1t': 'TTML1 transformation',
  'tt2f': 'TTML2 full',
  'tt2p': 'TTML2 presentation',
  'tt2t': 'TTML2 transformation',
  'etx1': 'EBU Subtitling Format v1.0',
  'etx2': 'EBU Subtitling Format v1.1',
  'etx3': 'EBU Subtitling Format v1.2',
  'etd1': 'EBU-TT Distribution v1.0',
  'etd2': 'EBU-TT Distribution v1.0.1',
  'etl1': 'EBU-TT Live',
  'ede1': 'IRT EBU-TT-D',
  'cfi1': 'DECE Image Subtitle Profile',
  'cft1': 'DECE Test Subtitle Profile',
};

export function hProfile(mode: string | undefined, profile: string | undefined): string {
  if (profile === undefined) return 'none';
  if (mode === 'ttml') return STPP_TTML_PROFILES[profile.toLowerCase()] ?? 'unknown';
  return 'unknown';
}
