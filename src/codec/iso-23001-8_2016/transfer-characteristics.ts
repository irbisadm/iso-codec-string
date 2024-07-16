export enum TransferCharacteristics {
  BT_709 = 1,
  UNSPECIFIED = 2,
  BT_470M = 4,
  BT_470BG = 5,
  SMPTE_170 = 6,
  SMPTE_240 = 7,
  LINEAR = 8,
  LOG_100 = 9,
  LOG_100_SQRT = 10,
  IEC_61966_2_4 = 11,
  BT_1361 = 12,
  SRGB = 13,
  BT_2020_10_BIT = 14,
  BT_2020_12_BIT = 15,
  SMPTE_2084 = 16,
  SMPTE_428 = 17,
  ARIB_STD_B67 = 18,
}

export function hTransferCharacteristics(transferCharacteristics:TransferCharacteristics):string{
  switch (transferCharacteristics){
    case TransferCharacteristics.BT_709: return 'bt.709';
    case TransferCharacteristics.UNSPECIFIED: return 'unspecified';
    case TransferCharacteristics.BT_470M: return 'bt.470.m';
    case TransferCharacteristics.BT_470BG: return 'bt.470.bg';
    case TransferCharacteristics.SMPTE_170: return 'smpte.170';
    case TransferCharacteristics.SMPTE_240: return 'smpte.240';
    case TransferCharacteristics.LINEAR: return 'linear';
    case TransferCharacteristics.LOG_100: return 'log.100';
    case TransferCharacteristics.LOG_100_SQRT: return 'log.100.sqrt';
    case TransferCharacteristics.IEC_61966_2_4: return 'iec.61966.2.4';
    case TransferCharacteristics.BT_1361: return 'bt.1361';
    case TransferCharacteristics.SRGB: return 'sRGB';
    case TransferCharacteristics.BT_2020_10_BIT: return 'bt.2020.10.bit';
    case TransferCharacteristics.BT_2020_12_BIT: return 'bt.2020.12.bit';
    case TransferCharacteristics.SMPTE_2084: return 'smpte.2084';
    case TransferCharacteristics.SMPTE_428: return 'smpte.428';
    case TransferCharacteristics.ARIB_STD_B67: return 'arib.std.b.67';
    default: return 'unknown';
  }
}
