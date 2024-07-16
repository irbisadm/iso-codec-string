export enum ColourPrimaries {
  BT_709 = 1,
  UNSPECIFIED = 2,
  BT_470M = 4,
  BT_470BG = 5,
  SMPTE_170 = 6,
  SMPTE_240 = 7,
  GENERIC_FILM = 8,
  BT_2020 = 9,
  SMPTE_428 = 10,
  SMPTE_431 = 11,
  SMPTE_432 = 12,
  EBU_3213E = 22,
}
export function hColourPrimaries(colorPrimaries:ColourPrimaries):string{
  switch (colorPrimaries){
    case ColourPrimaries.BT_709: return 'bt.709';
    case ColourPrimaries.UNSPECIFIED: return 'unspecified';
    case ColourPrimaries.BT_470M: return 'bt.470.m';
    case ColourPrimaries.BT_470BG: return 'bt.470.bg';
    case ColourPrimaries.SMPTE_170: return 'smpte.170';
    case ColourPrimaries.SMPTE_240: return 'smpte.240';
    case ColourPrimaries.GENERIC_FILM: return 'generic film'
    case ColourPrimaries.BT_2020: return 'bt.2020';
    case ColourPrimaries.SMPTE_428: return 'smpte.428';
    case ColourPrimaries.SMPTE_431: return 'smpte.431';
    case ColourPrimaries.SMPTE_432: return 'smpte.432';
    case ColourPrimaries.EBU_3213E: return 'ebu.3213E';
    default: return 'unknown';
  }
}