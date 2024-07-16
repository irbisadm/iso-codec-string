export enum VpxChromaSubsampling {
  UNSET = -1,
  CS_420_VERTICAL = 0,
  CS_420_COLOCATED_0_0 = 1,
  CS_422 = 2,
  CS_444 = 3,
}

export enum VpxBitDepth {
  UNSET = -1,
  BIT_DEPTH_8 = 8,
  BIT_DEPTH_10 = 10,
  BIT_DEPTH_12 = 12,
}

export enum VpxLevel {
  UNDEFINED = '00',
  LEVEL_1 = '10',
  LEVEL_1_1 = '11',
  LEVEL_2 = '20',
  LEVEL_2_1 = '21',
  LEVEL_3 = '30',
  LEVEL_3_1 = '31',
  LEVEL_4 = '40',
  LEVEL_4_1 = '41',
  LEVEL_5 = '50',
  LEVEL_5_1 = '51',
  LEVEL_5_2 = '52',
  LEVEL_6 = '60',
  LEVEL_6_1 = '61',
  LEVEL_6_2 = '62',
}

export enum VpxProfile {
  UNSET = -1,
  PROFILE_0,
  PROFILE_1,
  PROFILE_2,
  PROFILE_3,
}

export function hLevel(level:VpxLevel):string{
  if(level===VpxLevel.UNDEFINED) return 'undefined';
  return level[0]+'.'+level[1];
}
export function hChromaSubsampling(chromaSubsampling:VpxChromaSubsampling){
  switch (chromaSubsampling){
    case VpxChromaSubsampling.CS_444:
      return '4.4.4';
    case VpxChromaSubsampling.CS_422:
      return '4.2.2';
    case VpxChromaSubsampling.CS_420_VERTICAL:
      return '4.2.0 (vertical)';
    case VpxChromaSubsampling.CS_420_COLOCATED_0_0:
      return '4.2.0 (colocated 0:0)';
    default:
      return 'unknown';
  }
}

