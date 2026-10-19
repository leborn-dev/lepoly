'use strict';
// Bundle the public ES module entrypoints and the optional ShadyCSS fragments.
const esbuild = require('esbuild');
const babel = require('@babel/core');
const path = require('node:path');
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
  // Preserve the previous dist/compiled ES5 classic-script output contract.
  // Babel, rather than esbuild, lowers classes/accessors and all ES2015 syntax.
  await mkdir('dist/compiled', {recursive: true});
  const globals = {
    'polymer-element': 'PolymerElementBundle',
    'polymer-legacy': 'PolymerLegacyBundle',
    'apply-shim': 'ShadyCSSApplyShimBundle',
    'custom-style-interface': 'ShadyCSSCustomStyleBundle'
  };
  for (const [name, globalName] of Object.entries(globals)) {
    const entry = name.startsWith('polymer-') ? `${name}.js` :
        `node_modules/@webcomponents/shadycss/entrypoints/${name}.js`;
    const outfile = `dist/compiled/${name}.js`;
    const classic = await esbuild.build({
      entryPoints: [entry], outfile, bundle: true, format: 'iife', globalName,
      target: ['es2015'], minify: true, sourcemap: 'external', metafile: true,
      legalComments: 'inline', banner: {js: '"use strict";'}, write: false
    });
    const script = classic.outputFiles.find(file => file.path.endsWith('.js'));
    const sourceMap = classic.outputFiles.find(file => file.path.endsWith('.map'));
    const transformed = await babel.transformAsync(script.text, {
      filename: path.resolve(outfile), sourceType: 'script', configFile: false,
      babelrc: false, presets: [['@babel/preset-env', {
        targets: {ie: '11'}, forceAllTransforms: true, modules: false, bugfixes: true,
        useBuiltIns: false
      }]],
      comments: true, compact: true, minified: true, sourceMaps: true,
      inputSourceMap: JSON.parse(sourceMap.text)
    });
    const code = transformed.code + `\n//# sourceMappingURL=${name}.js.map\n`;
    await writeFile(outfile, code);
    await writeFile(`${outfile}.map`, JSON.stringify(transformed.map));
    Object.assign(result.metafile.inputs, classic.metafile.inputs);
    result.metafile.outputs[outfile] = {...classic.metafile.outputs[outfile],
      bytes: Buffer.byteLength(code), globalName, language: 'ES5'};
  }
  await writeFile('dist/metafile.json', JSON.stringify(result.metafile, null, 2) + '\n');
  const fs = require('node:fs');
  for (const file of Object.keys(result.metafile.outputs).filter(f => f.endsWith('.js'))) {
    const contents = fs.readFileSync(file);
    console.log(`${file}: ${contents.length} bytes (${gzipSync(contents).length} gzip)`);
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
