// H.266 / VVC (ISO/IEC 23090-3, carried per ISO/IEC 14496-15). Codec string:
//   <fourCC>.<general_profile_idc>.<L|H general_level_idc>[.<optional C/S/O fields...>]
// e.g. vvi1.1.L83 = Main 10 profile, Main tier, level 5.1.
//
// The mandatory profile / tier / level part is fully decoded. The optional fields
// (C = general constraints info, S = sub-profiles, O = output-layer-set + max temporal id)
// have a complex bit-packed encoding that is preserved verbatim rather than decoded.

export type VvcFourCC = 'vvc1' | 'vvi1';
export const VVC_FOUR_CCS: readonly VvcFourCC[] = ['vvc1', 'vvi1'];

// general_profile_idc values (ISO/IEC 23090-3 Annex A, VVC version 1).
export enum VvcProfileIdc {
  MAIN_10 = 1,
  MULTILAYER_MAIN_10 = 17,
  MAIN_10_4_4_4 = 33,
  MULTILAYER_MAIN_10_4_4_4 = 49,
  MAIN_10_STILL_PICTURE = 65,
  MAIN_10_4_4_4_STILL_PICTURE = 97,
}

export function hProfile(profileIdc: number): string {
  switch (profileIdc) {
    case VvcProfileIdc.MAIN_10: return 'Main 10';
    case VvcProfileIdc.MULTILAYER_MAIN_10: return 'Multilayer Main 10';
    case VvcProfileIdc.MAIN_10_4_4_4: return 'Main 10 4:4:4';
    case VvcProfileIdc.MULTILAYER_MAIN_10_4_4_4: return 'Multilayer Main 10 4:4:4';
    case VvcProfileIdc.MAIN_10_STILL_PICTURE: return 'Main 10 Still Picture';
    case VvcProfileIdc.MAIN_10_4_4_4_STILL_PICTURE: return 'Main 10 4:4:4 Still Picture';
    default: return 'unknown';
  }
}

// VVC levels: general_level_idc = 16 * major + 3 * minor (e.g. 51 -> 3.1, 83 -> 5.1, 102 -> 6.2).
export function hLevel(levelIdc: number): string {
  if (levelIdc <= 0) return 'unknown';
  return `${Math.floor(levelIdc / 16)}.${(levelIdc % 16) / 3}`;
}

export function hTier(tierFlag: number): string {
  return tierFlag ? 'high' : 'main';
}
