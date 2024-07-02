import {VpxBitDepth, VpxChromaSubsampling, VpxProfile} from "./enums";

export const profileLimitations: Record<VpxProfile, {
  bitDepth: VpxBitDepth[],
  chromaSubsampling: VpxChromaSubsampling[]
}> = {
  [VpxProfile.PROFILE_0]: {
    bitDepth: [VpxBitDepth.BIT_DEPTH_8, VpxBitDepth.UNSET],
    chromaSubsampling: [VpxChromaSubsampling.CS_420_COLOCATED_0_0, VpxChromaSubsampling.CS_420_VERTICAL, VpxChromaSubsampling.UNSET]
  },
  [VpxProfile.PROFILE_1]: {
    bitDepth: [VpxBitDepth.BIT_DEPTH_8, VpxBitDepth.UNSET],
    chromaSubsampling: [VpxChromaSubsampling.CS_422, VpxChromaSubsampling.CS_444, VpxChromaSubsampling.UNSET]
  },
  [VpxProfile.PROFILE_2]: {
    bitDepth: [VpxBitDepth.BIT_DEPTH_10, VpxBitDepth.BIT_DEPTH_12, VpxBitDepth.UNSET],
    chromaSubsampling: [VpxChromaSubsampling.CS_420_COLOCATED_0_0, VpxChromaSubsampling.CS_420_VERTICAL, VpxChromaSubsampling.UNSET]
  },
  [VpxProfile.PROFILE_3]: {
    bitDepth: [VpxBitDepth.BIT_DEPTH_10, VpxBitDepth.BIT_DEPTH_12, VpxBitDepth.UNSET],
    chromaSubsampling: [VpxChromaSubsampling.CS_422, VpxChromaSubsampling.CS_444, VpxChromaSubsampling.UNSET]
  },
  [VpxProfile.UNSET]: {
    bitDepth: [VpxBitDepth.UNSET, VpxBitDepth.BIT_DEPTH_8, VpxBitDepth.BIT_DEPTH_12, VpxBitDepth.BIT_DEPTH_10],
    chromaSubsampling: [VpxChromaSubsampling.UNSET, VpxChromaSubsampling.CS_420_VERTICAL, VpxChromaSubsampling.CS_420_COLOCATED_0_0, VpxChromaSubsampling.CS_422, VpxChromaSubsampling.CS_444]
  }
}
export const bitDepthLimitations: Record<VpxBitDepth, VpxProfile[]> = {
  [VpxBitDepth.BIT_DEPTH_8]: [VpxProfile.PROFILE_0, VpxProfile.PROFILE_1, VpxProfile.UNSET],
  [VpxBitDepth.BIT_DEPTH_10]: [VpxProfile.PROFILE_2, VpxProfile.PROFILE_3, VpxProfile.UNSET],
  [VpxBitDepth.BIT_DEPTH_12]: [VpxProfile.PROFILE_2, VpxProfile.PROFILE_3, VpxProfile.UNSET],
  [VpxBitDepth.UNSET]: [VpxProfile.UNSET, VpxProfile.PROFILE_0, VpxProfile.PROFILE_1, VpxProfile.PROFILE_2, VpxProfile.PROFILE_3]
}
export const chromaSubsamplingLimitations: Record<VpxChromaSubsampling, VpxProfile[]> = {
  [VpxChromaSubsampling.CS_420_COLOCATED_0_0]: [VpxProfile.PROFILE_0, VpxProfile.PROFILE_2, VpxProfile.UNSET],
  [VpxChromaSubsampling.CS_420_VERTICAL]: [VpxProfile.PROFILE_0, VpxProfile.PROFILE_2, VpxProfile.UNSET],
  [VpxChromaSubsampling.CS_422]: [VpxProfile.PROFILE_1, VpxProfile.PROFILE_3, VpxProfile.UNSET],
  [VpxChromaSubsampling.CS_444]: [VpxProfile.PROFILE_1, VpxProfile.PROFILE_3, VpxProfile.UNSET],
  [VpxChromaSubsampling.UNSET]: [VpxProfile.UNSET, VpxProfile.PROFILE_0, VpxProfile.PROFILE_1, VpxProfile.PROFILE_2, VpxProfile.PROFILE_3]
}
