# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@irbisadm/iso-codec-string` is a zero-dependency TypeScript library that parses and generates
ISO/RFC codec strings (the dot-separated identifiers used in MIME `codecs=` parameters, e.g.
`vp09.00.51.08`, `av01.00.13M.08.00.112.01.01.01.00`). Each codec has an info class that can be
built three ways: parsed `fromString`, constructed programmatically via setters, or serialized back
with `toString()`. Supported: VP8, VP9, AV1. H264/H265 are declared in the README roadmap but not
implemented.

## Commands

Run `npm install` first — the repo ships without `node_modules`, and both scripts below invoke local
binaries (`jest`, `rollup`) that live there.

- `npm test` — run the full Jest suite (ts-jest, no build step required).
- `npx jest src/codec/av1` — run a single directory's specs. `npx jest -t "parse from string"` runs
  a single test by name.
- `npm run build` — Rollup build (see two-pass detail below). Produces `dist/index.mjs` and `types/index.d.ts`.

There is no lint script and no CI config in the repo.

## Architecture

### Dispatch: two-tier factory by string prefix
`codecInfoFactory(codecString)` in `src/index.ts` is the public entry point. It branches on the
string prefix: `vp*` → `vpxInfoFactory` (in `src/codec/vpx/`), `av01` → `Av1Info.fromString`. The
VPx factory then sub-dispatches on the 4CC (`vp08` → `Vp8Info`, `vp09` → `Vp9Info`). **Adding a new
codec means wiring a new prefix branch here** (plus a re-export in `src/index.ts` and an `index.ts`
in the codec subfolder).

### `CodecInfo` base class
`src/codec/codec-info.ts` is a thin abstract base: a `codecName` field and an abstract
`toHumanReadable()`. Every codec info class also implements, by convention (not enforced by the base):
a static `fromString()` (parse), a `toString()` (serialize), and per-field getters/setters.

### Serialization is field-reversal + zero-padding
Both VPx and AV1 `toString()` push fields in *reverse* wire order into an array, then `.reverse()`
and map each field through `padStart(x, 2, '0')` (a hand-rolled pad in `src/codec/pad-start.ts`) and
`.join('.')`. The wire field layout is documented inline as a comment above each `toString`/`fromBox`.

### VPx `toString(skipDefaults = true)` trims trailing default fields
`VpXInfo.toString` (`src/codec/vpx/vpx-info.ts`) drops trailing colour fields
(videoFullRangeFlag → matrixCoefficients → transferCharacteristics → colourPrimaries →
chromaSubsampling) as long as each equals its default in `VPX_DEFAULTS`, producing the shortest legal
string. Once a non-default field is hit, `canBeSimplified` latches false and all remaining fields are
emitted. Pass `false` to force the full form (the round-trip tests rely on this).

### Setter validation is order-sensitive and cross-coupled
In `VpXInfo`, the `profile`, `bitDepth`, and `chromaSubsampling` setters validate against each other
using the lookup tables in `src/codec/vpx/limitations.ts` (e.g. profile 2 requires 10/12-bit).
Because each setter reads the *current* value of the others, **assignment order matters** — setting a
profile before a compatible bit depth can throw. This is why `fromBox` explicitly resets
`_chromaSubsampling` and `_bitDepth` to `UNSET` before parsing (UNSET is whitelisted in every
limitations row so it never trips validation mid-parse). Preserve this pattern when editing parse logic.

### Shared ISO/IEC 23001-8:2016 colour enums
`src/codec/iso-23001-8_2016/` holds the colour-signalling enums (colour primaries, transfer
characteristics, matrix coefficients, video full range) shared by both VPx and AV1. Do not duplicate
these per-codec — both codecs import from here.

### Human-readable output
Each enum module exports `h*` helper functions (`hLevel`, `hProfile`, `hChromaSubsampling`, …) that
map an enum value to a display string. `toHumanReadable()` on each info class just aggregates these
into a plain record. `-1`/`UNSET` sentinels render as `'unknown'`.

### Version injection
`src/index.ts` declares `export const version = '__lib_version__'`. The literal is replaced at build
time by `@rollup/plugin-replace` with the `version` from `package.json`. Never hardcode the version.

## Build pipeline (rollup.config.mjs)

Two sequential Rollup passes:
1. `src/index.ts` → `dist/index.mjs` (ESM, minified via terser). The `@rollup/plugin-typescript` pass
   emits `.d.ts` declarations to `dist/build/` as a side effect.
2. `dist/build/index.d.ts` → `types/index.d.ts`, bundled into a single declaration file via
   `rollup-plugin-dts`.

`package.json` `main`/`module` both point at `dist/index.mjs`; `types` points at `types/index.d.ts`.
`tsconfig.json` targets ES2018 with `strict` and `experimentalDecorators`, and excludes `**/*.spec.ts`
from the build (tests are compiled only by ts-jest).

## Tests

Specs are colocated as `*.spec.ts` next to their source. The dominant test strategy is
**exhaustive round-trip**: generate the full cartesian product of valid field combinations (see
`vp9-info.spec.ts` `testStringsBuilder`), parse each with `fromString`, and assert
`toString(false) === original`. When adding a codec or a new field, extend the generator rather than
adding isolated cases.
