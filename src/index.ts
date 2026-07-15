import {vpxInfoFactory} from "./codec/vpx";
import {Av1Info} from "./codec/av1";
import {H264Info} from "./codec/h264";
import {H265Info} from "./codec/h265";
import {H266Info} from "./codec/h266";
import {LcevcInfo} from "./codec/lcevc";
import {ApvInfo} from "./codec/apv";
import {EvcInfo} from "./codec/evc";
import {LhevcInfo} from "./codec/lhevc";
import {Mp4Info} from "./codec/mp4";
import {Avs3VideoInfo, Avs3AudioInfo} from "./codec/avs3";
import {MpeghInfo} from "./codec/mpegh";
import {SimpleCodecInfo, isSimpleCodec} from "./codec/simple";
import {UncvInfo} from "./codec/uncv";
import {Avs2AudioInfo} from "./codec/avs2";
import {StppInfo} from "./codec/stpp";

export * as vpx from "./codec/vpx";
export * as av1 from "./codec/av1";
export * as h264 from "./codec/h264";
export * as h265 from "./codec/h265";
export * as h266 from "./codec/h266";
export * as lcevc from "./codec/lcevc";
export * as apv from "./codec/apv";
export * as evc from "./codec/evc";
export * as lhevc from "./codec/lhevc";
export * as mp4 from "./codec/mp4";
export * as avs3 from "./codec/avs3";
export * as mpegh from "./codec/mpegh";
export * as simple from "./codec/simple";
export * as uncv from "./codec/uncv";
export * as avs2 from "./codec/avs2";
export * as stpp from "./codec/stpp";
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
  if (codecString.startsWith('lvc')) {
    return LcevcInfo.fromString(codecString);
  }
  if (codecString.startsWith('apv')) {
    return ApvInfo.fromString(codecString);
  }
  if (codecString.startsWith('evc')) {
    return EvcInfo.fromString(codecString);
  }
  if (codecString.startsWith('lhv') || codecString.startsWith('lhe')) {
    return LhevcInfo.fromString(codecString);
  }
  if (codecString.startsWith('mp4a') || codecString.startsWith('mp4v')) {
    return Mp4Info.fromString(codecString);
  }
  if (codecString.startsWith('avs3') || codecString.startsWith('lav3')) {
    return Avs3VideoInfo.fromString(codecString);
  }
  if (codecString.startsWith('av3a')) {
    return Avs3AudioInfo.fromString(codecString);
  }
  if (codecString.startsWith('cavs')) {
    return Avs2AudioInfo.fromString(codecString);
  }
  if (codecString.startsWith('mha') || codecString.startsWith('mhm')) {
    return MpeghInfo.fromString(codecString);
  }
  if (codecString.startsWith('uncv') || codecString.startsWith('unci')) {
    return UncvInfo.fromString(codecString);
  }
  if (codecString.startsWith('stpp')) {
    return StppInfo.fromString(codecString);
  }
  if (isSimpleCodec(codecString)) {
    return SimpleCodecInfo.fromString(codecString);
  }
  throw new Error('Unknown codec');
}