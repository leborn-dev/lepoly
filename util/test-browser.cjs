'use strict';
// Execute the exact suites and polyfill variants declared by test/runner.html.
const {startDevServer} = require('@web/dev-server');
const {chromium, firefox, webkit} = require('playwright');
const fs = require('node:fs/promises');

(async () => {
  const server = await startDevServer({config: {rootDir: process.cwd(), hostname: '127.0.0.1', port: 0, nodeResolve: true}, readCliArgs: false, readConfig: false});
  const port = server.server.address().port;
  const browserName = process.env.TEST_BROWSER || 'chromium';
  const engine = {chromium, firefox, webkit}[browserName];
  if (!engine) throw new Error(`Unsupported TEST_BROWSER: ${browserName}`);
  let browser;
  try {
    browser = await engine.launch({headless: true});
    const collector = await browser.newPage();
    await collector.goto(`http://127.0.0.1:${port}/test/runner.html`);
    await collector.waitForFunction(() => Array.isArray(window.__polymerSuites));
    const suites = await collector.evaluate(() => window.__polymerSuites);
    await collector.close();
    const selected = process.env.TEST_FILTER ? suites.filter(s => s.includes(process.env.TEST_FILTER)) : suites;
    if (!selected.length) throw new Error('No suites selected');
    const results = [];
    for (const suite of selected) {
      const page = await browser.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      try {
        await page.goto(`http://127.0.0.1:${port}/test/${suite}`);
        await page.waitForFunction(() => window.__polymerResult, null, {timeout: 120000});
        const result = await page.evaluate(() => window.__polymerResult);
        results.push({suite, ...result, errors});
        console.log(`${result.stats.failures || errors.length ? 'FAIL' : 'PASS'} ${suite}: ${result.stats.passes} passed, ${result.stats.failures} failed, ${result.stats.pending} pending`);
        for (const failure of result.failures) console.error(failure.test + ': ' + failure.message);
        for (const error of errors) console.error(error);
      } catch (error) {
        results.push({suite, errors: [...errors, error.message]});
        console.error(`FAIL ${suite}: ${errors.join('; ')}; ${error.message}`);
      } finally { await page.close(); }
    }
    const report = {browser: browserName, version: browser.version(), declaredSuites: suites.length, executedSuites: results.length, results};
    await fs.writeFile('browser-test-results.json', JSON.stringify(report, null, 2) + '\n');
    if (results.some(result => result.errors.length || !result.stats || result.stats.failures || result.stats.tests === 0)) process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    await server.stop();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
