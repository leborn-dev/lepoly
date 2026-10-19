'use strict';
// Bundle the public ES module entrypoints and the optional ShadyCSS fragments.
const esbuild = require('esbuild');
const {rm, mkdir, writeFile} = require('node:fs/promises');
const {gzipSync} = require('node:zlib');

(async () => {
  await rm('dist', {recursive: true, force: true});
  await mkdir('dist/bundled', {recursive: true});
  const result = await esbuild.build({
    entryPoints: {
      'polymer-element': 'polymer-element.js',
      'polymer-legacy': 'polymer-legacy.js',
      'apply-shim': 'node_modules/@webcomponents/shadycss/entrypoints/apply-shim.js',
      'custom-style-interface': 'node_modules/@webcomponents/shadycss/entrypoints/custom-style-interface.js'
    },
    outdir: 'dist/bundled', bundle: true, format: 'esm', target: ['es2018'],
    minify: true, sourcemap: true, metafile: true, legalComments: 'linked'
  });
  await writeFile('dist/metafile.json', JSON.stringify(result.metafile, null, 2) + '\n');
  const fs = require('node:fs');
  for (const file of Object.keys(result.metafile.outputs).filter(f => f.endsWith('.js'))) {
    const contents = fs.readFileSync(file);
    console.log(`${file}: ${contents.length} bytes (${gzipSync(contents).length} gzip)`);
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
