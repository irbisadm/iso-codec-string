import {codecInfoFactory, version, vpx, av1, h264, h265, h266, lcevc} from './index';

describe('codecInfoFactory', () => {
  it('dispatches vp8 strings to Vp8Info', () => {
    const info = codecInfoFactory('vp08');
    expect(info).toBeInstanceOf(vpx.Vp8Info);
    expect(info.codecName).toBe('vp8');
  });

  it('dispatches vp9 strings to Vp9Info', () => {
    const info = codecInfoFactory('vp09.00.51.08');
    expect(info).toBeInstanceOf(vpx.Vp9Info);
    expect((info as vpx.Vp9Info).level).toBe(vpx.VpxLevel.LEVEL_5_1);
  });

  it('dispatches av01 strings to Av1Info', () => {
    const info = codecInfoFactory('av01.0.13M.08.0.112.01.01.01.0');
    expect(info).toBeInstanceOf(av1.Av1Info);
    expect((info as av1.Av1Info).profile).toBe(av1.Av1Profile.MAIN);
  });

  it('dispatches avc strings to H264Info', () => {
    const info = codecInfoFactory('avc1.640028');
    expect(info).toBeInstanceOf(h264.H264Info);
    expect(info.codecName).toBe('h264');
    expect((info as h264.H264Info).profileIdc).toBe(h264.AvcProfileIdc.HIGH);
  });

  it('dispatches hev/hvc strings to H265Info', () => {
    const info = codecInfoFactory('hvc1.1.6.L93.B0');
    expect(info).toBeInstanceOf(h265.H265Info);
    expect(info.codecName).toBe('h265');
    expect((info as h265.H265Info).levelIdc).toBe(93);
  });

  it('dispatches vvc/vvi strings to H266Info', () => {
    const info = codecInfoFactory('vvi1.1.L83');
    expect(info).toBeInstanceOf(h266.H266Info);
    expect(info.codecName).toBe('h266');
    expect((info as h266.H266Info).levelIdc).toBe(83);
  });

  it('dispatches lvc strings to LcevcInfo', () => {
    const info = codecInfoFactory('lvc1.vprf0.vlev4');
    expect(info).toBeInstanceOf(lcevc.LcevcInfo);
    expect(info.codecName).toBe('lcevc');
    expect((info as lcevc.LcevcInfo).levelIdc).toBe(4);
  });

  it('throws on an unknown codec', () => {
    expect(() => codecInfoFactory('mp4a.40.2')).toThrow('Unknown codec');
    expect(() => codecInfoFactory('theora')).toThrow('Unknown codec');
  });
});

describe('version', () => {
  it('is a string', () => {
    // Replaced by the real version at build time; stays as the token under ts-jest.
    expect(typeof version).toBe('string');
  });
});
