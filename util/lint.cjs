'use strict';
const {ESLint} = require('eslint');
(async () => {
  const eslint = new ESLint();
  const results = await eslint.lintFiles(['lib/**/*.js', 'test/unit/*.{html,js}', 'util/*.{js,cjs}']);
  const formatter = await eslint.loadFormatter('stylish');
  const output = formatter.format(results);
  if (output) console.log(output);
  if (results.some(result => result.errorCount > 0)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
