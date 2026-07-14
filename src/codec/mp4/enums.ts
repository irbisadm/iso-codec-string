// MP4 audio/video via the RFC 6381 ObjectTypeIndication (OTI) scheme:
//   mp4a.<OTI>[.<audio object type>]   e.g. mp4a.40.2 (AAC-LC), mp4a.69 / mp4a.6B (MP3)
//   mp4v.<OTI>[.<profile-level>]       e.g. mp4v.20.9 (MPEG-4 Visual SP L0), mp4v.61 (MPEG-2 Video)
// OTI is two uppercase hex digits; the optional third element is a decimal number.

export type Mp4FourCC = 'mp4a' | 'mp4v';
export const MP4_FOUR_CCS: readonly Mp4FourCC[] = ['mp4a', 'mp4v'];

// MP4 Registration Authority ObjectTypeIndication values (mp4ra.org/registered-types/object-types).
export function hObjectTypeIndication(oti: number): string {
  switch (oti) {
    case 0x20: return 'MPEG-4 Visual';
    case 0x21: return 'AVC / H.264';
    case 0x23: return 'HEVC / H.265';
    case 0x60: return 'MPEG-2 Video Simple Profile';
    case 0x61: return 'MPEG-2 Video Main Profile';
    case 0x62: return 'MPEG-2 Video SNR Profile';
    case 0x63: return 'MPEG-2 Video Spatial Profile';
    case 0x64: return 'MPEG-2 Video High Profile';
    case 0x65: return 'MPEG-2 Video 4:2:2 Profile';
    case 0x66: return 'MPEG-2 AAC Main Profile';
    case 0x67: return 'MPEG-2 AAC Low Complexity Profile';
    case 0x68: return 'MPEG-2 AAC Scalable Sampling Rate Profile';
    case 0x69: return 'MPEG-2 Audio Part 3 (MP3)';
    case 0x6a: return 'MPEG-1 Video';
    case 0x6b: return 'MPEG-1 Audio (MP3)';
    case 0x6c: return 'JPEG';
    case 0x6d: return 'PNG';
    case 0x6e: return 'JPEG 2000';
    case 0x40: return 'MPEG-4 Audio (AAC)';
    case 0xa9: return 'DTS Coherent Acoustics';
    case 0xaa: return 'DTS-HD High Resolution Audio';
    case 0xab: return 'DTS-HD Master Audio';
    case 0xac: return 'DTS Express';
    default: return 'unknown';
  }
}

// MPEG-4 Audio object types (ISO/IEC 14496-3) — the third element when OTI is 0x40.
export function hAudioObjectType(audioObjectType: number): string {
  switch (audioObjectType) {
    case 1: return 'AAC Main';
    case 2: return 'AAC-LC';
    case 3: return 'AAC SSR';
    case 4: return 'AAC LTP';
    case 5: return 'SBR (HE-AAC)';
    case 6: return 'AAC Scalable';
    case 7: return 'TwinVQ';
    case 29: return 'PS (HE-AAC v2)';
    case 34: return 'MP3 (MPEG-1 Layer III)';
    case 42: return 'xHE-AAC (USAC)';
    default: return 'unknown';
  }
}
