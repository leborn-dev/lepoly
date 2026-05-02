# About this fork

`LePoly` is a [Leborn](https://github.com/leborn-dev) fork of [Polymer](https://github.com/Polymer/polymer).

## Why this fork exists

Polymer is in maintenance mode at Google, with Lit being the recommended successor. Many enterprise applications still run on Polymer; AI-assisted Polymer to Lit migration is a clear opportunity.

## What we are doing

This fork goes through 5 phases:

- **Phase A: Setup and Analysis** - Docker dev environment, codebase overview, dependency status, compatibility issues
- **Phase B: Modern Node.js LTS compatibility** - Make the codebase run on Modern Node.js LTS
- **Phase C: Lit migration toolchain** - Update EOL dependencies to current versions
- **Phase D: Tests and CI** - Test coverage and matrix CI on GitHub Actions
- **Phase E: AI-native rebirth and v0.1.0 release** - AI-assisted Polymer -> Lit migration tool. Web Components standard-compliant rewriting.

## Status

This is an **early-stage** fork. The repository was initialized on 2026-05-02 with a full mirror of the upstream codebase. Modernization and Leborn-specific features are tracked in [Issues](../../issues).

Estimated duration to v0.1.0: **2 weeks** (with Claude Code-augmented development).

## Original project

- Name: Polymer
- Repository: https://github.com/Polymer/polymer
- License: BSD-3-Clause

This fork retains all upstream commit history (see `git log`). Original maintainers and contributors are credited in commit metadata. See `NOTICE` for the formal attribution.

## About Leborn

[Leborn](https://github.com/leborn-dev) is an initiative to revive popular but stalled open-source projects with AI-native enhancements designed for the 2026 era of software. Leborn is sponsored and operated by [LLL Sdn Bhd](https://lll.dev) (Malaysia).

The name "Leborn" is from "Reborn" with the R replaced by L (for LLL).

## License

This fork retains the original BSD-3-Clause license. See `LICENSE`.
