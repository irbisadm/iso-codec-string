import {vpxInfoFactory} from "./codec/vpx";
import {Av1Info} from "./codec/av1";
import {H264Info} from "./codec/h264";
import {H265Info} from "./codec/h265";
import {H266Info} from "./codec/h266";

export * as vpx from "./codec/vpx";
export * as av1 from "./codec/av1";
export * as h264 from "./codec/h264";
export * as h265 from "./codec/h265";
export * as h266 from "./codec/h266";
export * from './codec/codec-info';

export const version = '__lib_version__'; // Version will be injected on the build

export const codecInfoFactory = (codecString: string) => {
  if (codecString.startsWith('vp')) {
    return vpxInfoFactory(codecString);
  }
  if (codecString.startsWith('av01')) {
    return Av1Info.fromString(codecString);
  }
  if (codecString.startsWith('avc')) {
    return H264Info.fromString(codecString);
  }
  if (codecString.startsWith('hev') || codecString.startsWith('hvc')) {
    return H265Info.fromString(codecString);
  }
  if (codecString.startsWith('vvc') || codecString.startsWith('vvi')) {
    return H266Info.fromString(codecString);
  }
  throw new Error('Unknown codec');
}