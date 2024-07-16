export enum MatrixCoefficients {
  RGB = 0,
  BT_709 = 1,
  UNSPECIFIED = 2,
  BT_470M = 4,
  BT_470BG = 5,
  SMPTE_170 = 6,
  SMPTE_240 = 7,
  YCOCG = 8,
  BT_2020_NCL = 9,
  BT_2020_CL = 10,
  SMPTE_2085 = 11,
  CHROMAT_NCL = 12,
  CHROMAT_CL = 13,
  ITP_1667 = 14,
  SMPTE_428 = 15,
  SMPTE_431 = 16,
  SMPTE_432 = 17,
  EBU_3213E = 18,
}

export function hMatrixCoefficients(matrixCoefficients:MatrixCoefficients):string{
  switch (matrixCoefficients){
    case MatrixCoefficients.RGB: return 'RGB';
    case MatrixCoefficients.BT_709: return 'bt.709';
    case MatrixCoefficients.UNSPECIFIED: return 'unspecified';
    case MatrixCoefficients.BT_470M: return 'bt.470.m';
    case MatrixCoefficients.BT_470BG: return 'bt.470.bg';
    case MatrixCoefficients.SMPTE_170: return 'smpte.170';
    case MatrixCoefficients.SMPTE_240: return 'smpte.240';
    case MatrixCoefficients.YCOCG: return 'YCOCG';
    case MatrixCoefficients.BT_2020_NCL: return 'bt.2020.ncl';
    case MatrixCoefficients.BT_2020_CL: return 'bt.2020.cl';
    case MatrixCoefficients.SMPTE_2085: return 'smpte.2085';
    case MatrixCoefficients.CHROMAT_NCL: return 'chromat.ncl';
    case MatrixCoefficients.CHROMAT_CL: return 'chromat.cl';
    case MatrixCoefficients.ITP_1667: return 'itp.1667';
    case MatrixCoefficients.SMPTE_428: return 'smpte.428';
    case MatrixCoefficients.SMPTE_431: return 'smpte.431';
    case MatrixCoefficients.SMPTE_432: return 'smpte.432';
    case MatrixCoefficients.EBU_3213E: return 'ebu.3213.e';
    default: return 'unknown';
  }
}