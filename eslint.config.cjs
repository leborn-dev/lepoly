const js = require('@eslint/js');
const globals = require('globals');
const html = require('eslint-plugin-html');
const jsdoc = require('eslint-plugin-jsdoc').default;
const test = require('./test/.eslintrc.json');
const legacy = require('./.eslintrc.json');
const rules = {...legacy.rules};
delete rules['valid-jsdoc'];
module.exports = [{
  files: ['lib/**/*.js', 'test/unit/*.{html,js}', 'util/*.{js,cjs}'],
  plugins: {html, jsdoc},
  languageOptions: {
    ecmaVersion: 'latest', sourceType: 'module',
    globals: {...globals.browser, ...legacy.globals}
  },
  rules: {...js.configs.recommended.rules, ...rules,
    'no-unused-vars': ['error', {caughtErrors: 'none'}],
    // Match the original ESLint 4 recommended policy while using the current parser.
    'no-prototype-builtins': 'off', 'getter-return': 'off',
    'no-useless-assignment': 'off', 'no-unassigned-vars': 'off',
    'no-constant-binary-expression': 'off',
    'no-self-assign': ['error', {props: false}],
    'jsdoc/check-types': 'error', 'jsdoc/check-param-names': 'error'
  },
  settings: {jsdoc: {mode: 'closure', preferredTypes: legacy.rules['valid-jsdoc'][1].preferType}}
}, {
  files: ['test/**/*.{html,js}'],
  languageOptions: {globals: {...globals.mocha, ...test.globals}},
  rules: test.rules
}, {
  files: ['util/*.{js,cjs}'],
  languageOptions: {sourceType: 'commonjs', globals: globals.node}
}];
