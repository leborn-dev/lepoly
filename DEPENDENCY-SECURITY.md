# Dependency security maintenance (2026-10-18)

The npm lockfile was refreshed within the existing package.json dependency
ranges. Library source, public API, build tasks, and declared dependencies are
unchanged. Install reproducibly with `npm ci`.

Validation with Node 22: clean `npm ci --ignore-scripts`, explicit
`npm run generate-types` (the project's prepare task), `npm run lint`, and a
Chromium PolymerElement smoke test passed. The smoke test created a custom
element, rendered `Hello Leborn` in its shadow root, and changed its property to
render `Hello Changed` without browser errors.

`npm run build` still invokes a nonexistent default Gulp task. The existing
Gulpfile has no default task; this pre-existing command defect is not repaired by
this security-only lockfile update. Full Polymer/Web Component Tester browser
matrix and Closure compilation were not verified.

Full npm audit affected-package counts decreased from 157 (critical40/high71/
moderate38/low8) to 150 (critical40/high67/moderate36/low7). Production-only audit
is zero. These counts include propagated parent findings and differ from the
29 GitHub Dependabot alerts initially observed.

The remaining findings are in the old development CLI/build/test stack,
including polymer-cli, polymer-build, Web Component Tester, old Selenium/Sauce
Labs packages, and their transitive dependencies. Several advisories, such as
xmldom, have no patched version in that package. Replacing the complete upstream
build/test toolchain requires its own migration and browser compatibility
validation; this update does not claim those findings are resolved. No audit
suppression, override, force, or dependency replacement is used.
