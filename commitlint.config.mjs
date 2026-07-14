// Commit messages follow Conventional Commits; releases are automated from them.
// See CONTRIBUTING.md. The header stays short, but bodies/footers routinely carry
// bullet points, file paths and URLs, so their length limits are disabled.
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [0, 'always'],
    'footer-max-line-length': [0, 'always'],
  },
};
