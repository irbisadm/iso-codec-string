import {codecInfoFactory, version, vpx, av1, h264, h265, h266, lcevc, apv, evc, lhevc, mp4, avs3, mpegh} from './index';

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

  it('dispatches apv strings to ApvInfo', () => {
    const info = codecInfoFactory('apv1.apvf44.apvl210.apvb3');
    expect(info).toBeInstanceOf(apv.ApvInfo);
    expect(info.codecName).toBe('apv');
    expect((info as apv.ApvInfo).profileIdc).toBe(44);
  });

  it('dispatches evc strings to EvcInfo', () => {
    const info = codecInfoFactory('evc1.vprf1.vlev51');
    expect(info).toBeInstanceOf(evc.EvcInfo);
    expect(info.codecName).toBe('evc');
    expect((info as evc.EvcInfo).levelIdc).toBe(51);
  });

  it('dispatches lhv/lhe strings to LhevcInfo', () => {
    const info = codecInfoFactory('lhv1.2.4.L120.B0');
    expect(info).toBeInstanceOf(lhevc.LhevcInfo);
    expect(info.codecName).toBe('lhevc');
    expect((info as lhevc.LhevcInfo).ptl.levelIdc).toBe(120);
  });

  it('dispatches mp4a/mp4v strings to Mp4Info', () => {
    const audio = codecInfoFactory('mp4a.40.2');
    expect(audio).toBeInstanceOf(mp4.Mp4Info);
    expect(audio.codecName).toBe('mp4a');
    expect((audio as mp4.Mp4Info).objectType).toBe(2);

    const video = codecInfoFactory('mp4v.20.9');
    expect(video).toBeInstanceOf(mp4.Mp4Info);
    expect(video.codecName).toBe('mp4v');
  });

  it('dispatches avs3 strings to Avs3VideoInfo', () => {
    const info = codecInfoFactory('avs3.20.10');
    expect(info).toBeInstanceOf(avs3.Avs3VideoInfo);
    expect(info.codecName).toBe('avs3');
    expect((info as avs3.Avs3VideoInfo).profileId).toBe(0x20);
  });

  it('dispatches av3a strings to Avs3AudioInfo', () => {
    const info = codecInfoFactory('av3a.01');
    expect(info).toBeInstanceOf(avs3.Avs3AudioInfo);
    expect(info.codecName).toBe('av3a');
  });

  it('dispatches mha/mhm strings to MpeghInfo', () => {
    const info = codecInfoFactory('mhm1.0c');
    expect(info).toBeInstanceOf(mpegh.MpeghInfo);
    expect(info.codecName).toBe('mpegh');
    expect((info as mpegh.MpeghInfo).profileLevelId).toBe(0x0c);
  });

  it('throws on an unknown codec', () => {
    expect(() => codecInfoFactory('theora')).toThrow('Unknown codec');
    expect(() => codecInfoFactory('tx3g')).toThrow('Unknown codec');
  });
});

describe('version', () => {
  it('is a string', () => {
    // Replaced by the real version at build time; stays as the token under ts-jest.
    expect(typeof version).toBe('string');
  });
});
