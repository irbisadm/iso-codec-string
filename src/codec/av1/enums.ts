export enum Av1ChromaSamplePosition {
  UNKNOWN = 0, //Unknown (in this case the source video transfer function must be signaled outside the AV1 bitstream)
  VERTICAL = 1, // Horizontally co-located with (0, 0) luma sample, vertical position in the middle between two luma samples
  COLOCATED_WITH_LUMA = 2, // co-located with (0, 0) luma sample
  RESERVED = 3,
}

export enum Av1BitDepth {
  UNSET = -1,
  BIT_DEPTH_8 = 8,
  BIT_DEPTH_10 = 10,
  BIT_DEPTH_12 = 12,
}

export enum Av1Profile {
  UNSET = -1,
  MAIN = 0,
  HIGH = 1,
  PROFESSIONAL = 2,
}

export enum Av1Level {
  UNSET = -1,
  LEVEL_2_0 = 0,
  LEVEL_2_1 = 1,
  LEVEL_2_2 = 2,
  LEVEL_2_3 = 3,
  LEVEL_3_0 = 4,
  LEVEL_3_1 = 5,
  LEVEL_3_2 = 6,
  LEVEL_3_3 = 7,
  LEVEL_4_0 = 8,
  LEVEL_4_1 = 9,
  LEVEL_4_2 = 10,
  LEVEL_4_3 = 11,
  LEVEL_5_0 = 12,
  LEVEL_5_1 = 13,
  LEVEL_5_2 = 14,
  LEVEL_5_3 = 15,
  LEVEL_6_0 = 16,
  LEVEL_6_1 = 17,
  LEVEL_6_2 = 18,
  LEVEL_6_3 = 19,
  LEVEL_7_0 = 20,
  LEVEL_7_1 = 21,
  LEVEL_7_2 = 22,
  LEVEL_7_3 = 23,
}

export enum Av1Tier {
  UNSET = -1,
  MAIN = 'M',
  HIGH = 'H'
}

export function hProfile(profile:Av1Profile):string{
  switch (profile){
    case Av1Profile.MAIN: return 'main';
    case Av1Profile.HIGH: return 'high';
    case Av1Profile.PROFESSIONAL: return 'professional';
    default: return 'unknown';
  }
}

export function hTier(tier:Av1Tier):string{
  switch (tier){
    case Av1Tier.MAIN: return 'main';
    case Av1Tier.HIGH: return 'high';
    default: return 'unknown';
  }
}

export function hLevel(level:Av1Level):string{
  switch (level){
    case Av1Level.LEVEL_2_0: return '2.0';
    case Av1Level.LEVEL_2_1: return '2.1';
    case Av1Level.LEVEL_2_2: return '2.2';
    case Av1Level.LEVEL_2_3: return '2.3';
    case Av1Level.LEVEL_3_0: return '3.0';
    case Av1Level.LEVEL_3_1: return '3.1';
    case Av1Level.LEVEL_3_2: return '3.2';
    case Av1Level.LEVEL_3_3: return '3.3';
    case Av1Level.LEVEL_4_0: return '4.0';
    case Av1Level.LEVEL_4_1: return '4.1';
    case Av1Level.LEVEL_4_2: return '4.2';
    case Av1Level.LEVEL_4_3: return '4.3';
    case Av1Level.LEVEL_5_0: return '5.0';
    case Av1Level.LEVEL_5_1: return '5.1';
    case Av1Level.LEVEL_5_2: return '5.2';
    case Av1Level.LEVEL_5_3: return '5.3';
    case Av1Level.LEVEL_6_0: return '6.0';
    case Av1Level.LEVEL_6_1: return '6.1';
    case Av1Level.LEVEL_6_2: return '6.2';
    case Av1Level.LEVEL_6_3: return '6.3';
    case Av1Level.LEVEL_7_0: return '7.0';
    case Av1Level.LEVEL_7_1: return '7.1';
    case Av1Level.LEVEL_7_2: return '7.2';
    case Av1Level.LEVEL_7_3: return '7.3';
    default: return 'unknown';
  }
}

export function hChromaSamplePosition(chromaSamplePosition:Av1ChromaSamplePosition):string{
  switch (chromaSamplePosition){
    case Av1ChromaSamplePosition.VERTICAL: return  'vertical';
    case Av1ChromaSamplePosition.COLOCATED_WITH_LUMA: return  'colocated with luma';
    case Av1ChromaSamplePosition.RESERVED: return  'reserved';
    default: return 'unknown';
  }
}
