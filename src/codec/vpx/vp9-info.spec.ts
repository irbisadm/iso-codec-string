import {VpxChromaSubsampling, VpxLevel, VpxProfile} from "./enums";
import {ColourPrimaries} from "../iso-23001-8_2016";
import {Vp9Info} from "./vp9-info";

const testStringsBuilder = ():string[]=>{
  const levels = ['00','10','11','20','21','30','31','40','41','50','51','52','60','61','62'];
  const makeWithLevel = (profile:string,bitDepth:string[],chromaSubsampling:string[] )=>{
    const samples:string[] = [];
    levels.forEach(level=>{
      const prfx = `vp09.${profile}.${level}`;
      bitDepth.forEach(bd=>{
        chromaSubsampling.forEach(cs=>{
          samples.push(`${prfx}.${bd}.${cs}`);
        })
      });
    })
    return samples;
  }

  const profile0 = makeWithLevel('00',['08'],['00','01']);
  const profile1 = makeWithLevel('01',['08'],['02','03']);
  const profile2 = makeWithLevel('02',['10','12'],['00','01']);
  const profile3 = makeWithLevel('03',['10','12'],['02','03']);

  const validHeaders = [...profile0, ...profile1, ...profile2, ...profile3];

  const pickR = (arr:string[])=>{
    return arr[Math.floor(Math.random()*arr.length)];
  }

  const testSuite:string[] = [];

  const colourPrimaries = ['01','02','04','05','06','07','08','09','10','11','12','22'];
  const transferCharacteristics = ['01','02','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18'];
  const matrixCoefficients = ['00','01','02','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18'];
  const videoFullRangeFlag = ['00','01'];
  for(let i=0;i<1_000_000;i++){
    // <sample entry 4CC>.<profile>.<level>.<bitDepth>.<chromaSubsampling>.
    // <colourPrimaries>.<transferCharacteristics>.<matrixCoefficients>.
    // <videoFullRangeFlag>
    testSuite.push(`${pickR(validHeaders)}.${pickR(colourPrimaries)}.${pickR(transferCharacteristics)}.${pickR(matrixCoefficients)}.${pickR(videoFullRangeFlag)}`);
  }
  return testSuite;
}

describe('VP8 codecs tests',()=>{
  it('without settings', () => {
    const codecInfo = new Vp9Info();
    expect(codecInfo.profile).toBe(VpxProfile.PROFILE_0);
    expect(codecInfo.level).toBe(VpxLevel.UNDEFINED);
    expect(codecInfo.chromaSubsampling).toBe(VpxChromaSubsampling.CS_420_COLOCATED_0_0);
    expect(codecInfo.colourPrimaries).toBe(ColourPrimaries.BT_709);
    expect(''+codecInfo).toBe('vp09');
  })
  it('parse all strings',()=>{
    const testStrings = testStringsBuilder();
    for(let i=0;i<testStrings.length;i++){
      const codecInfo = Vp9Info.fromString(testStrings[i]);
      expect(codecInfo.toString(false)).toBe(testStrings[i]);
    }
  })
})
