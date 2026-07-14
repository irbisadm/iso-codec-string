// MPEG-H 3D Audio (ISO/IEC 23008-3), carried per ISO/IEC 14496-15 / the MPEG-H file format.
// Codec string: <fourCC>.<mpegh3daProfileLevelIndication>  e.g. mhm1.0c
//   mha1/mha2 — config out-of-band; mhm1/mhm2 — MHAS in-band (single / multi-stream).

export type MpeghFourCC = 'mha1' | 'mha2' | 'mhm1' | 'mhm2';
export const MPEGH_FOUR_CCS: readonly MpeghFourCC[] = ['mha1', 'mha2', 'mhm1', 'mhm2'];

// mpegh3daProfileLevelIndication values (only the ones with a confirmed mapping are named).
export function hProfileLevel(profileLevelId: number): string {
  switch (profileLevelId) {
    case 0x0b: return 'LC Profile Level 1';
    case 0x0c: return 'LC Profile Level 2';
    case 0x0d: return 'LC Profile Level 3';
    case 0x10: return 'BL Profile Level 1';
    case 0x11: return 'BL Profile Level 2';
    case 0x12: return 'BL Profile Level 3';
    default: return 'unknown';
  }
}
