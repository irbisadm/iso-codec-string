// EVC / MPEG-5 Part 1 (ISO/IEC 23094-1), carried per ISO/IEC 14496-15. Codec string:
//   evc1.vprf<profile>.vlev<level>[.vtoh<hex>.vtol<hex>.vbit.vcss.vcpr.vtrc.vmac.vfrf.vfpq.vpci.vsar]
// e.g. evc1.vprf1.vlev51 (minimal) or the full colour-signalled form. vprf/vlev are mandatory;
// the rest are optional and preserved verbatim.

export type EvcFourCC = 'evc1';
export const EVC_FOUR_CCS: readonly EvcFourCC[] = ['evc1'];

export enum EvcProfile {
  BASELINE = 0,
  MAIN = 1,
  BASELINE_STILL_PICTURE = 2,
  MAIN_STILL_PICTURE = 3,
}

// Recognised optional parameter keys, in the canonical order they are emitted.
export const EVC_OPTIONAL_KEYS: readonly string[] = [
  'vtoh', 'vtol', 'vbit', 'vcss', 'vcpr', 'vtrc', 'vmac', 'vfrf', 'vfpq', 'vpci', 'vsar',
];

export function hProfile(profileIdc: number): string {
  switch (profileIdc) {
    case EvcProfile.BASELINE: return 'Baseline';
    case EvcProfile.MAIN: return 'Main';
    case EvcProfile.BASELINE_STILL_PICTURE: return 'Baseline Still Picture';
    case EvcProfile.MAIN_STILL_PICTURE: return 'Main Still Picture';
    default: return 'unknown';
  }
}

// EVC levels follow the AVC-style level_idc / 10 (e.g. 51 -> 5.1, 20 -> 2.0).
export function hLevel(levelIdc: number): string {
  if (levelIdc <= 0) return 'unknown';
  return `${Math.floor(levelIdc / 10)}.${levelIdc % 10}`;
}
