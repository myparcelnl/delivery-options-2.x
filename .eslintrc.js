// import '../myparcel-core/dmp-standards/eslint/eslint-jsdoc.config.js'
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['../myparcel-core/dmp-standards/eslint/eslint-vue.config.js'],
  rules: {
    'jsdoc/no-undefined-types': [
      'warn', {
        definedTypes: ['MyParcelCheckout'],
      },
    ],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
