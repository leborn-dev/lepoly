'use strict';
const fs = require('node:fs/promises');
const header =
`/**
 * @fileoverview Generated typings for Polymer mixins
 * @externs
 * @suppress {checkPrototypalTypes}
 *
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
/* eslint-disable */
`;

(async () => {
  const {generateDeclarations} = require('@polymer/gen-closure-declarations');
  const declarations = await generateDeclarations();
  if (!declarations.includes('Polymer_ElementMixin')) throw new Error('Missing Polymer mixin declarations');
  await fs.mkdir('externs', {recursive: true});
  await fs.writeFile('externs/closure-types.js', `${header}${declarations}`);
})().catch(error => { console.error(error); process.exitCode = 1; });
