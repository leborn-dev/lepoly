'use strict';
const {Analyzer, FsUrlLoader, generateAnalysis, validateAnalysis} = require('polymer-analyzer');
const {writeFile} = require('node:fs/promises');
(async () => {
  const analyzer = new Analyzer({urlLoader: new FsUrlLoader(process.cwd()), moduleResolution: 'node'});
  const analysis = await analyzer.analyze(['polymer-element.js', 'polymer-legacy.js']);
  const descriptor = generateAnalysis(analysis, analyzer.urlResolver);
  validateAnalysis(descriptor);
  await writeFile('analysis.json', JSON.stringify(descriptor, null, 2) + '\n');
  console.log('Wrote analysis.json for the public Polymer entrypoints');
})().catch(error => { console.error(error); process.exitCode = 1; });
