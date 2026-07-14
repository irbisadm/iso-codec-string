// Uncompressed video / images (ISO/IEC 23001-17), sample entries uncv (video) and unci (image).
// Codec string: <fourCC>[.<profile>] where <profile> is a registered uncompressed-video profile
// 4CC (mp4ra.org/registered-types/uncv-profiles), e.g. uncv.rgba, uncv.i420. Bare uncv is the
// generic (non-profiled) form.

export type UncvFourCC = 'uncv' | 'unci';
export const UNCV_FOUR_CCS: readonly UncvFourCC[] = ['uncv', 'unci'];

const UNCV_PROFILES: Readonly<Record<string, string>> = {
  '2vuy': '8-bit YUV 4:2:2 (Cb Y0 Cr Y1)',
  'yuv2': '8-bit YUV 4:2:2 (Y0 Cb Y1 Cr)',
  'yvyu': '8-bit YUV 4:2:2 (Y0 Cr Y1 Cb)',
  'vyuy': '8-bit YUV 4:2:2 (Cr Y0 Cb Y1)',
  'yuv1': '8-bit YUV 4:1:1 (Y0 Y1 Cb Y2 Y3 Cr)',
  'v308': '8-bit YUV 4:4:4 (Cr Y Cb)',
  'v408': '8-bit YUVA 4:4:4:4 (Cb Y Cr A)',
  'v216': 'YUV 4:2:2 (10-16 bit)',
  'v210': '10-bit YUV 4:2:2',
  'v410': '10-bit YUV 4:4:4',
  'y210': '10-bit YUV 4:2:2 (little-endian)',
  'i420': 'YUV 4:2:0 8-bit planar',
  'nv12': 'YUV 4:2:0 8-bit semi-planar (Y CbCr)',
  'nv21': 'YUV 4:2:0 8-bit semi-planar (Y CrCb)',
  'rgb3': 'RGB 24-bit packed',
  'rgba': 'RGBA 32-bit packed',
  'abgr': 'ABGR 32-bit packed',
};

export function hProfile(profile: string): string {
  return UNCV_PROFILES[profile.toLowerCase()] ?? 'unknown';
}
