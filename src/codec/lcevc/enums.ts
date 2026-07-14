// LCEVC / MPEG-5 Part 2 (ISO/IEC 23094-2), carried per ISO/IEC 14496-15. Codec string:
//   lvc1.vprf<profile_idc>.vlev<level_idc>
// e.g. lvc1.vprf0.vlev4 = Main profile, level 4. LCEVC is an enhancement layer over a base codec.

export type LcevcFourCC = 'lvc1';
export const LCEVC_FOUR_CCS: readonly LcevcFourCC[] = ['lvc1'];

export enum LcevcProfile {
  MAIN = 0,
  MAIN_4_4_4 = 1,
}

export function hProfile(profileIdc: number): string {
  switch (profileIdc) {
    case LcevcProfile.MAIN: return 'Main';
    case LcevcProfile.MAIN_4_4_4: return 'Main 4:4:4';
    default: return 'unknown';
  }
}

export function hLevel(levelIdc: number): string {
  if (levelIdc <= 0) return 'unknown';
  return String(levelIdc);
}
