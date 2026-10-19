/* Browser bridge for the existing HTML Mocha suites. */
(function() {
  'use strict';
  const scripts = ['mocha/mocha.js', 'chai/chai.js', 'sinon/pkg/sinon.js',
    '@polymer/test-fixture/test-fixture.js', '@polymer/test-fixture/test-fixture-mocha.js'];
  for (const script of scripts) document.write('<script src="/node_modules/' + script + '"><\/script>');
  document.write('<script src="/test/browser-start.js"><\/script>');
})();
