export abstract class CodecInfo {
  codecName: string = 'unk';

  abstract toHumanReadable():Record<string, string|number|boolean>;
}
