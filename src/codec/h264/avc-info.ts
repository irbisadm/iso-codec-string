import {CodecInfo} from "../codec-info";
import {padStart} from "../pad-start";
import {
  AVC_FOUR_CCS,
  AvcFourCC,
  constraintSetFlag,
  hLevel,
  hProfile,
} from "./enums";

function assertByte(value: number, name: string): number {
  if (!Number.isInteger(value) || value < 0 || value > 255) {
    throw new Error(`${name} must be a byte in the range 0-255`);
  }
  return value;
}

// H.264 / AVC codec information.
// Codec string (RFC 6381): <fourCC>.<profile_idc><constraint_flags><level_idc>, three bytes hex-encoded.
export class H264Info extends CodecInfo {
  codecName = 'h264';

  private _fourCC: AvcFourCC = 'avc1';
  private _profileIdc = 0;
  private _constraintFlags = 0;
  private _levelIdc = 0;

  get fourCC(): AvcFourCC {
    return this._fourCC;
  }

  set fourCC(fourCC: AvcFourCC) {
    if (!AVC_FOUR_CCS.includes(fourCC)) {
      throw new Error(`Invalid AVC sample entry: ${fourCC}`);
    }
    this._fourCC = fourCC;
  }

  get profileIdc(): number {
    return this._profileIdc;
  }

  set profileIdc(profileIdc: number) {
    this._profileIdc = assertByte(profileIdc, 'profile_idc');
  }

  get constraintFlags(): number {
    return this._constraintFlags;
  }

  set constraintFlags(constraintFlags: number) {
    this._constraintFlags = assertByte(constraintFlags, 'constraint_flags');
  }

  get levelIdc(): number {
    return this._levelIdc;
  }

  set levelIdc(levelIdc: number) {
    this._levelIdc = assertByte(levelIdc, 'level_idc');
  }

  get constraintSet0(): boolean { return constraintSetFlag(this._constraintFlags, 0); }
  set constraintSet0(on: boolean) { this.setConstraintSet(0, on); }
  get constraintSet1(): boolean { return constraintSetFlag(this._constraintFlags, 1); }
  set constraintSet1(on: boolean) { this.setConstraintSet(1, on); }
  get constraintSet2(): boolean { return constraintSetFlag(this._constraintFlags, 2); }
  set constraintSet2(on: boolean) { this.setConstraintSet(2, on); }
  get constraintSet3(): boolean { return constraintSetFlag(this._constraintFlags, 3); }
  set constraintSet3(on: boolean) { this.setConstraintSet(3, on); }
  get constraintSet4(): boolean { return constraintSetFlag(this._constraintFlags, 4); }
  set constraintSet4(on: boolean) { this.setConstraintSet(4, on); }
  get constraintSet5(): boolean { return constraintSetFlag(this._constraintFlags, 5); }
  set constraintSet5(on: boolean) { this.setConstraintSet(5, on); }

  private setConstraintSet(n: number, on: boolean) {
    const mask = 1 << (7 - n);
    this._constraintFlags = on ? this._constraintFlags | mask : this._constraintFlags & ~mask;
  }

  static fromString(codecString: string): H264Info {
    const dot = codecString.indexOf('.');
    const fourCC = (dot === -1 ? codecString : codecString.slice(0, dot)) as AvcFourCC;
    if (!AVC_FOUR_CCS.includes(fourCC)) {
      throw new Error('Unknown codec');
    }
    const params = dot === -1 ? '' : codecString.slice(dot + 1);
    if (!/^[0-9a-fA-F]{6}$/.test(params)) {
      throw new Error('Invalid AVC codec string, expected <fourCC>.PPCCLL');
    }
    const info = new H264Info();
    info.fourCC = fourCC;
    info.profileIdc = parseInt(params.slice(0, 2), 16);
    info.constraintFlags = parseInt(params.slice(2, 4), 16);
    info.levelIdc = parseInt(params.slice(4, 6), 16);
    return info;
  }

  toString(): string {
    const hex = (value: number) => padStart(value.toString(16).toUpperCase(), 2, '0');
    return `${this._fourCC}.${hex(this._profileIdc)}${hex(this._constraintFlags)}${hex(this._levelIdc)}`;
  }

  toHumanReadable() {
    return {
      fourCC: this._fourCC,
      profile: hProfile(this._profileIdc, this._constraintFlags),
      profileIdc: this._profileIdc,
      level: hLevel(this._levelIdc, this._profileIdc, this._constraintFlags),
      levelIdc: this._levelIdc,
      constraintSet0: this.constraintSet0,
      constraintSet1: this.constraintSet1,
      constraintSet2: this.constraintSet2,
      constraintSet3: this.constraintSet3,
      constraintSet4: this.constraintSet4,
      constraintSet5: this.constraintSet5,
    } as const;
  }
}
