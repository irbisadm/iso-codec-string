// L-HEVC / Layered HEVC (SHVC, MV-HEVC), carried per ISO/IEC 14496-15. Codec string:
//   <fourCC>.<HEVC profile-tier-level>[.S<scalability mask>]
// e.g. lhv1.2.4.L120.B0 (same profile-tier-level syntax as hvc1), optionally followed by a
// scalability field ".S<XX>". The PTL part is decoded via the HEVC parser; the scalability field
// is preserved verbatim (its byte encoding is not freely specified).

export type LhevcFourCC = 'lhv1' | 'lhe1';
export const LHEVC_FOUR_CCS: readonly LhevcFourCC[] = ['lhv1', 'lhe1'];
