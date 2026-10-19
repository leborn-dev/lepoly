/* global mocha, chai */
(function() {
  'use strict';
  window.addEventListener('error', function(event) {
    if (window.uncaughtErrorFilter && window.uncaughtErrorFilter(event.error)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
  mocha.setup({ui: 'tdd', timeout: 60000});
  window.assert = chai.assert;
  window.expect = chai.expect;
  window.WCT = {loadSuites(suites) { window.__polymerSuites = suites; }};
  window.addEventListener('load', function() {
    if (window.__polymerSuites) return;
    const failures = [];
    const runner = mocha.run();
    runner.on('fail', function(test, error) {
      failures.push({test: test.fullTitle(), message: error.message, stack: error.stack});
    });
    runner.on('end', function() {
      window.__polymerResult = {stats: runner.stats, failures};
    });
  });
})();
