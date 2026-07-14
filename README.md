# @irbisadm/iso-codec-string

[![npm](https://img.shields.io/npm/v/@irbisadm/iso-codec-string.svg)](https://www.npmjs.com/package/@irbisadm/iso-codec-string)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![types](https://img.shields.io/badge/types-TypeScript-blue.svg)](#)
[![CI](https://github.com/irbisadm/iso-codec-string/actions/workflows/ci.yml/badge.svg)](https://github.com/irbisadm/iso-codec-string/actions/workflows/ci.yml)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Parse and generate ISO/RFC codec strings — the dot-separated identifiers used in the MIME `codecs=`
parameter (e.g. `vp09.00.51.08`, `av01.0.13M.08.0.112.01.01.01.0`) — in pure TypeScript, with no
runtime dependencies.

Useful for reading codec parameters out of a `codecs=` string, checking support with
`MediaSource.isTypeSupported()`, or building a correct codec string from a set of parameters.

## Supported codecs

| Codec | Parse | Generate |
|-------|:-----:|:--------:|
| VP8   | ✅    | ✅       |
| VP9   | ✅    | ✅       |
| AV1   | ✅    | ✅       |
| H.264 (AVC) | ✅ | ✅   |
| H.265 (HEVC) | ✅ | ✅  |
| H.266 (VVC) | ✅ | ✅   |
| LCEVC | ✅ | ✅          |
| APV   | ✅ | ✅          |
| EVC   | ✅ | ✅          |

## Install

```sh
npm install @irbisadm/iso-codec-string
```

Ships as an ES module with bundled TypeScript declarations. Requires Node.js >= 18.

## Usage

### Parse a codec string

`codecInfoFactory` picks the right codec from the string prefix and returns a populated info object.

```ts
import { codecInfoFactory } from '@irbisadm/iso-codec-string';

const info = codecInfoFactory('vp09.00.51.08');
console.log(info.level); // VpxLevel.LEVEL_5_1
```

### Build a codec string

Construct an info object, set its fields, and serialize with `toString()`.

```ts
import { vpx } from '@irbisadm/iso-codec-string';

const info = new vpx.Vp9Info();
info.level = vpx.VpxLevel.LEVEL_5_1;
info.bitDepth = vpx.VpxBitDepth.BIT_DEPTH_8;
console.log(info.toString()); // 'vp09.00.51.08'
```

Setters validate cross-field constraints — for example, VP9 profile 2 requires a 10- or 12-bit depth,
and an incompatible combination throws.

### Human-readable output

Every info object can expand its numeric fields into display strings.

```ts
import { av1 } from '@irbisadm/iso-codec-string';

const info = av1.Av1Info.fromString('av01.0.13M.08.0.112.01.01.01.0');
console.log(info.toHumanReadable());
// { profile: 'main', level: '5.1', tier: 'main', bitDepth: '8', ... }
```

### H.264 / AVC

The AVC codec string encodes `profile_idc`, the constraint-set flags, and `level_idc` as three
hex bytes. Fields are exposed as raw bytes and decoded in `toHumanReadable()`.

```ts
import { h264 } from '@irbisadm/iso-codec-string';

const info = h264.H264Info.fromString('avc1.640028');
console.log(info.toHumanReadable().profile); // 'High'
console.log(info.toHumanReadable().level);   // '4.0'
console.log(info.toString());                // 'avc1.640028'
```

## API

- `codecInfoFactory(codecString)` — dispatches by prefix (`vp08`/`vp8`, `vp09`/`vp9`, `av01`,
  `avc1`/`avc2`/`avc3`/`avc4`, `hev1`/`hvc1`, `vvc1`/`vvi1`, `lvc1`, `apv1`, `evc1`) and returns a
  `Vp8Info`, `Vp9Info`, `Av1Info`, `H264Info`, `H265Info`, `H266Info`, `LcevcInfo`, `ApvInfo`, or
  `EvcInfo`. Throws `Unknown codec` for anything else.
- `vpx` — namespace exporting `Vp8Info`, `Vp9Info`, `vpxInfoFactory`, and the `Vpx*` enums.
- `av1` — namespace exporting `Av1Info` and the `Av1*` enums.
- `h264` — namespace exporting `H264Info`, `AvcProfileIdc`, and the `hProfile`/`hLevel` helpers.
- `h265` — namespace exporting `H265Info`, `HevcProfileIdc`, and the `hProfile`/`hLevel`/`hTier` helpers.
- `h266` — namespace exporting `H266Info`, `VvcProfileIdc`, and the `hProfile`/`hLevel`/`hTier` helpers.
  The mandatory profile/tier/level is decoded; the optional VVC constraint (`C`), sub-profile (`S`)
  and output-layer-set (`O`) fields are preserved verbatim for round-tripping.
- `lcevc` — namespace exporting `LcevcInfo` and `LcevcProfile` (MPEG-5 Part 2 enhancement codec,
  `lvc1.vprf<profile>.vlev<level>`).
- `apv` — namespace exporting `ApvInfo` (Advanced Professional Video,
  `apv1.apvf<profile>.apvl<level>.apvb<band>`).
- `evc` — namespace exporting `EvcInfo`, `EvcProfile` (MPEG-5 Part 1,
  `evc1.vprf<profile>.vlev<level>`). Mandatory profile/level are decoded; the optional toolset,
  bit-depth and colour parameters are preserved verbatim.
- Shared ISO/IEC 23001-8:2016 colour enums (`ColourPrimaries`, `TransferCharacteristics`,
  `MatrixCoefficients`, `VideoFullRangeFlag`) are re-exported from both namespaces.

Each info class exposes `fromString()` (parse), `toString()` (serialize), `toHumanReadable()`, and
per-field getters/setters.

## Contributing

Contributions are welcome. Commits follow [Conventional Commits](https://www.conventionalcommits.org/)
and releases are automated with [semantic-release](https://github.com/semantic-release/semantic-release).
See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

MIT © 2024 Igor Sheko. See [LICENSE](./LICENSE).
