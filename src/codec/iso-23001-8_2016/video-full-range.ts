export enum VideoFullRangeFlag {
  LEGAL = 0,
  FULL = 1,
}

export function hVideoFullRangeFlag(videoFullRangeFlag:VideoFullRangeFlag):string{
  switch (videoFullRangeFlag){
    case VideoFullRangeFlag.FULL: return 'full';
    case VideoFullRangeFlag.LEGAL: return 'legal';
    default: return 'unknown';
  }
}