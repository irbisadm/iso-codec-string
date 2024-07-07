import {vpxInfoFactory} from "./codec/vpx";
import {Av1Info} from "./codec/av1";

export * as vpx from "./codec/vpx";
export * as av1 from "./codec/av1";
export * from './codec/codec-info';

export const version = '__lib_version__'; // Version will be injected on the build

export const codecInfoFactory = (codecString: string) => {
  if (codecString.startsWith('vp')) {
    return vpxInfoFactory(codecString);
  }
  if (codecString.startsWith('av01')) {
    return Av1Info.fromString(codecString);
  }
  throw new Error('Unknown codec');
}