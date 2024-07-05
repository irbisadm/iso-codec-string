import {vpxInfoFactory} from "./codec/vpx";
import {Av1Info} from "./codec/av1/av1-info";

export * as vpx from "./codec/vpx";

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