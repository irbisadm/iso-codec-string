// APV — Advanced Professional Video (OpenAPV / APVA), carried per ISO/IEC 14496-15. Codec string:
//   apv1.apvf<profile_idc>.apvl<level_idc>.apvb<band_idc>
// e.g. apv1.apvf44.apvl210.apvb3 = profile 422-12, level 7, band 3.

export type ApvFourCC = 'apv1';
export const APV_FOUR_CCS: readonly ApvFourCC[] = ['apv1'];

// Only the profile_idc confirmed by the OpenAPV codec-string documentation is named here; other
// values are reported by their numeric profile_idc via toHumanReadable().profileIdc.
export function hProfile(profileIdc: number): string {
  switch (profileIdc) {
    case 44: return '422-12';
    default: return 'unknown';
  }
}

// The OpenAPV example maps level_idc 210 to level 7, i.e. level = level_idc / 30.
export function hLevel(levelIdc: number): string {
  if (levelIdc <= 0) return 'unknown';
  return String(levelIdc / 30);
}
