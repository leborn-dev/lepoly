# Scoped compatibility fork

Source: @polymer/marked-element 3.0.1, https://github.com/PolymerElements/marked-element (BSD-3-Clause, original source headers retained).

This fork retains the upstream element and all of its properties/events/rendering behavior. Only marked-import.js changes: import the public ES module `marked` export rather than the retired CommonJS/browser side effect path. The dependency is marked 4.3.x, which preserves the existing renderer, sanitizer, and callback API and includes fixes for GHSA-xf5p-87ch-gxw2, GHSA-rrrm-qjm4-v8hf, and GHSA-5v2h-r2cx-5xgj. An actual browser regression renders Markdown through this element.

Rebase by copying the upstream source and reapplying this small import change. Remove the fork when upstream exposes a compatible maintained parser dependency.

Canonical package names and the upstream element version are retained so audit tooling still recognizes both packages. The element source is byte-for-byte identical to the published @polymer/marked-element 3.0.1 tarball; the import bridge and package dependency are the actual changes. Review future npm audit/GitHub advisories against **both** @polymer/marked-element and marked; retain the full npm audit in CI. For any new Marked advisory, update within the compatible 4.x API when possible, or explicitly migrate sanitizer/renderer/callback contracts and repeat the DOM-based security tests. Marked 5+ removes deprecated options used by this upstream element; do not force that major through an override.
