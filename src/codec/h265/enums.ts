// H.265 / HEVC (ISO/IEC 23008-2, carried per ISO/IEC 14496-15). Codec string per RFC 6381 / MDN:
//   <fourCC>.<space?profile_idc>.<compat_flags_hex>.<L|H level_idc>[.<constraint bytes...>]
// e.g. hvc1.2.4.L153.B0 = Main 10 profile, level 5.1, Main tier.

export type HevcFourCC = 'hev1' | 'hvc1';
export const HEVC_FOUR_CCS: readonly HevcFourCC[] = ['hev1', 'hvc1'];

// general_profile_idc values (ISO/IEC 23008-2 Annex A and extensions).
export enum HevcProfileIdc {
  MAIN = 1,
  MAIN_10 = 2,
  MAIN_STILL_PICTURE = 3,
  RANGE_EXTENSIONS = 4,
  HIGH_THROUGHPUT = 5,
  MULTIVIEW_MAIN = 6,
  SCALABLE_MAIN = 7,
  THREE_D_MAIN = 8,
  SCREEN_CONTENT_CODING = 9,
  SCALABLE_RANGE_EXTENSIONS = 10,
  HIGH_THROUGHPUT_SCREEN_CONTENT = 11,
}

export function hProfile(profileIdc: number): string {
  switch (profileIdc) {
    case HevcProfileIdc.MAIN: return 'Main';
    case HevcProfileIdc.MAIN_10: return 'Main 10';
    case HevcProfileIdc.MAIN_STILL_PICTURE: return 'Main Still Picture';
    case HevcProfileIdc.RANGE_EXTENSIONS: return 'Range Extensions';
    case HevcProfileIdc.HIGH_THROUGHPUT: return 'High Throughput';
    case HevcProfileIdc.MULTIVIEW_MAIN: return 'Multiview Main';
    case HevcProfileIdc.SCALABLE_MAIN: return 'Scalable Main';
    case HevcProfileIdc.THREE_D_MAIN: return '3D Main';
    case HevcProfileIdc.SCREEN_CONTENT_CODING: return 'Screen-Extended';
    case HevcProfileIdc.SCALABLE_RANGE_EXTENSIONS: return 'Scalable Range Extensions';
    case HevcProfileIdc.HIGH_THROUGHPUT_SCREEN_CONTENT: return 'High Throughput Screen-Extended';
    default: return 'unknown';
  }
}

// HEVC levels are general_level_idc / 30 (e.g. 93 -> 3.1, 153 -> 5.1, 186 -> 6.2).
export function hLevel(levelIdc: number): string {
  if (levelIdc <= 0) return 'unknown';
  return `${Math.floor(levelIdc / 30)}.${(levelIdc % 30) / 3}`;
}

export function hTier(tierFlag: number): string {
  return tierFlag ? 'high' : 'main';
}
