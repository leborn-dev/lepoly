const {test} = require('node:test');
const assert = require('node:assert/strict');
const {spawnSync} = require('node:child_process');
const fs = require('node:fs');

test('build produces usable minified modern and legacy Polymer module bundles', () => {
  const result = spawnSync('npm', ['run', 'build'], {encoding: 'utf8'});
  assert.equal(result.status, 0, result.stdout + result.stderr);
  for (const name of ['polymer-element.js', 'polymer-legacy.js', 'apply-shim.js', 'custom-style-interface.js']) {
    const code = fs.readFileSync(`dist/bundled/${name}`, 'utf8');
    assert.ok(code.length > 100, `${name} must contain bundled code`);
    assert.ok(!/from ["']@webcomponents\//.test(code), `${name} must bundle bare imports`);
  }
  assert.match(fs.readFileSync('dist/bundled/polymer-element.js', 'utf8'), /PolymerElement/);
  assert.match(fs.readFileSync('dist/bundled/polymer-legacy.js', 'utf8'), /Polymer/);
});

test('analyze generates the public documentation descriptor', () => {
  const result = spawnSync('npm', ['run', 'analyze'], {encoding: 'utf8'});
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const analysis = JSON.parse(fs.readFileSync('analysis.json', 'utf8'));
  assert.equal(analysis.schema_version, '1.0.0');
  assert.ok(JSON.stringify(analysis).includes('PolymerElement'));
});
