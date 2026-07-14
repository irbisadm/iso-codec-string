# Contributing

Thanks for your interest in improving `@irbisadm/iso-codec-string`.

## Development

```sh
npm install      # install dependencies
npm test         # run the Jest suite
npm run typecheck # type-check the sources (tsc --noEmit)
npm run build    # bundle to dist/ and types/ with Rollup
```

Run a single test file or test name:

```sh
npx jest src/codec/av1
npx jest -t "parse from string"
```

## Commit messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/). The commit **type**
drives the next release, so it matters:

- `fix:` — a bug fix → patch release
- `feat:` — a new feature (e.g. a new codec) → minor release
- `feat!:` / `BREAKING CHANGE:` in the body → major release
- `docs:`, `test:`, `chore:`, `ci:`, `build:`, `refactor:` — no release on their own

Commit messages are linted with commitlint on every pull request.

## Releases

Releases are fully automated by [semantic-release](https://github.com/semantic-release/semantic-release)
when commits land on `main`: it computes the next version from the commit history, updates
`CHANGELOG.md`, tags the release, and publishes to npm via
[OIDC trusted publishing](https://docs.npmjs.com/trusted-publishers) (no npm token required).
Do not bump the version in `package.json` by hand.
