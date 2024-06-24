import {Vp8Info} from "./vp8-info";
import {Vp9Info} from "./vp9-info";

import {VpxCodec} from "./codec";

export const vpxInfoFactory = (codecString: string) => {
  if (codecString.startsWith(VpxCodec.VP8) || codecString === 'vp8') {
    return Vp8Info.fromString(codecString);
  }
  if (codecString.startsWith(VpxCodec.VP9) || codecString === 'vp9') {
    return Vp9Info.fromString(codecString);
  }
  throw new Error('Unknown codec');
}
