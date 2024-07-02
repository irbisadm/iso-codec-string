import {VpXInfo} from "./vpx-info";
import {VpxProfile} from "./enums";
import {VpxCodec} from "./codec";

export class Vp8Info extends VpXInfo {
  codecName = 'vp8';

  constructor() {
    super(VpxCodec.VP8);
  }

  get profile() {
    return this._profile;
  }

  set profile(profile: VpxProfile) {
    if (profile !== VpxProfile.PROFILE_0) {
      throw new Error('VP8 only supports a profile value of 0.');
    }
    super.profile = profile;
  }

  static fromString(isoString: string) {
    const box = isoString.split('.');
    const info = new Vp8Info();
    info.fromBox(box);
    return info;
  }
}
