// H.264 / AVC (ISO/IEC 14496-10). Codec string per RFC 6381:
//   <fourCC>.<profile_idc><constraint_flags><level_idc>  (three bytes, hex-encoded)
// e.g. avc1.640028 = High profile, level 4.0.

// Sample-entry 4CCs that carry an AVCDecoderConfigurationRecord.
export type AvcFourCC = 'avc1' | 'avc2' | 'avc3' | 'avc4';
export const AVC_FOUR_CCS: readonly AvcFourCC[] = ['avc1', 'avc2', 'avc3', 'avc4'];

// Common profile_idc values (ISO/IEC 14496-10 Annex A and amendments).
export enum AvcProfileIdc {
  CAVLC_4_4_4_INTRA = 44,
  BASELINE = 66,
  MAIN = 77,
  SCALABLE_BASELINE = 83,
  SCALABLE_HIGH = 86,
  EXTENDED = 88,
  HIGH = 100,
  HIGH_10 = 110,
  MULTIVIEW_HIGH = 118,
  HIGH_4_2_2 = 122,
  STEREO_HIGH = 128,
  MULTIVIEW_DEPTH_HIGH = 138,
  HIGH_4_4_4_PREDICTIVE = 244,
}

// constraint_set flags byte: bit 7 = constraint_set0_flag ... bit 2 = constraint_set5_flag,
// bits 1..0 reserved. constraint_setN_flag lives at bit (7 - N).
export function constraintSetFlag(constraintFlags: number, n: number): boolean {
  return Boolean((constraintFlags >> (7 - n)) & 1);
}

export function hProfile(profileIdc: number, constraintFlags: number): string {
  const cs = (n: number) => constraintSetFlag(constraintFlags, n);
  switch (profileIdc) {
    case AvcProfileIdc.CAVLC_4_4_4_INTRA:
      return 'CAVLC 4:4:4 Intra';
    case AvcProfileIdc.BASELINE:
      return cs(1) ? 'Constrained Baseline' : 'Baseline';
    case AvcProfileIdc.MAIN:
      return 'Main';
    case AvcProfileIdc.SCALABLE_BASELINE:
      return 'Scalable Baseline';
    case AvcProfileIdc.SCALABLE_HIGH:
      return 'Scalable High';
    case AvcProfileIdc.EXTENDED:
      return 'Extended';
    case AvcProfileIdc.HIGH:
      if (cs(4) && cs(5)) return 'Constrained High';
      if (cs(4)) return 'Progressive High';
      return 'High';
    case AvcProfileIdc.HIGH_10:
      return cs(3) ? 'High 10 Intra' : 'High 10';
    case AvcProfileIdc.MULTIVIEW_HIGH:
      return 'Multiview High';
    case AvcProfileIdc.HIGH_4_2_2:
      return cs(3) ? 'High 4:2:2 Intra' : 'High 4:2:2';
    case AvcProfileIdc.STEREO_HIGH:
      return 'Stereo High';
    case AvcProfileIdc.MULTIVIEW_DEPTH_HIGH:
      return 'Multiview Depth High';
    case AvcProfileIdc.HIGH_4_4_4_PREDICTIVE:
      return cs(3) ? 'High 4:4:4 Intra' : 'High 4:4:4 Predictive';
    default:
      return 'unknown';
  }
}

export function hLevel(levelIdc: number, profileIdc: number, constraintFlags: number): string {
  // Level 1b is signalled either by level_idc 11 + constraint_set3_flag (Baseline/Main/Extended)
  // or by level_idc 9 for the High profiles.
  if (levelIdc === 11 && constraintSetFlag(constraintFlags, 3) &&
      [AvcProfileIdc.BASELINE, AvcProfileIdc.MAIN, AvcProfileIdc.EXTENDED].includes(profileIdc)) {
    return '1b';
  }
  if (levelIdc === 9 &&
      [AvcProfileIdc.HIGH, AvcProfileIdc.HIGH_10, AvcProfileIdc.HIGH_4_2_2, AvcProfileIdc.HIGH_4_4_4_PREDICTIVE].includes(profileIdc)) {
    return '1b';
  }
  if (levelIdc <= 0) return 'unknown';
  return `${Math.floor(levelIdc / 10)}.${levelIdc % 10}`;
}
