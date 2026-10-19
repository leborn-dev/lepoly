# Secure Polymer development toolchain implementation plan

**Goal:** Eliminate all reported development dependency vulnerabilities while preserving library behavior and useful build, serve, lint, type generation, and browser tests.

**Architecture:** Replace the unmaintained Polymer CLI shrinkwrap and the obsolete gulp/polymer-build stack with esbuild and Web Dev Server. Run the existing HTML Mocha suites using Playwright, preserving query variants, native Shadow DOM, forced ShadyDOM, and forced Custom Elements. Keep the existing analyzer-based Closure declaration generator, updating its resolved dependencies.

**Files:** package.json/package-lock.json; util/build.cjs; util/generate-types.cjs; util/lint.cjs; util/test-browser.cjs; test/browser-setup.js; test/tooling/toolchain.test.cjs; README.md; CI workflow.

- [x] Write and run a failing build integration test; retain the exact failure evidence.
- [x] Replace build tooling with reproducible minified ES module bundles, preserving PolymerElement and legacy Polymer exports, and including standalone ShadyCSS fragment bundles.
- [x] Retain Closure declarations using the existing generator. Preserve source lint policy using current ESLint and the HTML processor.
- [x] Replace WCT orchestration with Mocha/Chai/Sinon browser setup and Playwright, executing the unchanged suite list across its native/shady/custom element variants. Report every failed assertion and browser exception.
- [x] Update documented commands and Node compatibility, run clean npm ci, full npm audit, lint, type generation, integration tests, and full browser suites. Run a built-bundle Shadow DOM/property test.
- [x] Capture exact HEAD, audit JSON, command logs, artifact content and variants; submit a PR for independent review.

Sources: https://modern-web.dev/docs/dev-server/overview/ ; https://esbuild.github.io/api/#build ; https://mochajs.org/#running-mocha-in-the-browser ; https://github.com/Polymer/tools/tree/master/packages/cli .
Rollback: revert this migration commit and restore its prior package lock. No deployment or global configuration changes are involved.

Validation: clean `npm ci` (including prepare) and full `npm audit` report zero vulnerabilities. All 219 browser documents/variants completed: 7,137 passed, 43 pre-existing pending, zero failures and zero page errors. All original 6,618 assert call sites in 67 modified unit HTML files are preserved; only bootstrap paths and the three renamed Sinon resetHistory calls change. The single executable library change fixes a ShadyDOM hit-test bug reproduced with unmodified origin/master source under the original WCT/Mocha/Chai browser stack. Declaration generation is byte-identical to the archived baseline commit.

Independent QA follow-up: remove the development Node engine from published/root lock metadata, and retain the old `dist/compiled` ES5 classic-script output contract. Regression tests first observed both failures. Build now also generates four ES5 classic scripts using patched Babel 7 preset-env (IE11 target and forceAllTransforms), with source maps and public export globals. Every compiled artifact is parsed as ES5; both public entrypoints run element/property/export checks under native and forced polyfill environments. Source library files are untouched in this follow-up.
