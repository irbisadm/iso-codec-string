import {vpxInfoFactory} from "./codec/vpx";

export * as vpx from "./codec/vpx";

export const version = '__lib_version__'; // Version will be injected on the build

export const codecInfoFactory = (codecString: string) => {
  if (codecString.startsWith('vp')) {
    return vpxInfoFactory(codecString);
  }
  throw new Error('Unknown codec');
}