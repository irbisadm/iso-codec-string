import {VpXInfo} from "./vpx-info";


import {VpxCodec} from "./codec";

export class Vp9Info extends VpXInfo {
  codecName = 'vp9';

  constructor() {
    super(VpxCodec.VP9);
  }

  static fromString(isoString: string) {
    const box = isoString.split('.');
    const info = new Vp9Info();
    info.fromBox(box);
    return info;
  }
}
