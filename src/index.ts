import {VpxBitDepth, VpxChromaSubsampling, vpxInfoFactory, VpxLevel, VpxProfile} from "./codec/vpx";
import {
  ColourPrimaries,
  MatrixCoefficients,
  TransferCharacteristics,
  VideoFullRangeFlag
} from "./codec/iso-23001-8_2016";
export * as vpx from "./codec/vpx";

export const version = '__lib_version__'; // Version will be injected on the build

export const codecInfoFactory = (codecString: string)=>{
  if(codecString.startsWith('vp')){
    return vpxInfoFactory(codecString);
  }
  throw new Error('Unknown codec');
}

export const codecInfoFromBox = (codecString: string)=>{
  const box = codecString[0].split('.');
  const output:Record<string, any> = {};
  if (box[1]) {
    output.profile = parseInt(box[1]) as VpxProfile;
  }
  if (box[2]) {
    output.level = parseInt(box[2]).toString() as VpxLevel;
  }
  if (box[3]) {
    output.bitDepth = parseInt(box[3]) as VpxBitDepth;
  }
  if (box[4]) {
    output.chromaSubsampling = parseInt(box[4]) as VpxChromaSubsampling;
  }
  if (box[5]) {
    output.colourPrimaries = parseInt(box[5]) as ColourPrimaries;
  }
  if (box[6]) {
    output.transferCharacteristics = parseInt(box[6]) as TransferCharacteristics;
  }
  if (box[7]) {
    output.matrixCoefficients = parseInt(box[7]) as MatrixCoefficients;
  }
  if (box[8]) {
    output.videoFullRangeFlag = parseInt(box[8]) as VideoFullRangeFlag;
  }

  if (box.length > 9) {
    throw new Error('Invalid box');
  }
  return output;
}