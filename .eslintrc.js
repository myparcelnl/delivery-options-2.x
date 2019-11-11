module.exports = {
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  extends: [
    '@myparcel/eslint-config/preset-vue',
  ],
  rules: {
    'jsdoc/no-undefined-types': [
      'warn', {
        definedTypes: ['MyParcel'],
      },
    ],
  },
  overrides: [
    {
      files: ['./update-package.js'],
      rules: {
        'no-magic-numbers': "off",
        'no-console': "off",
      },
    },
  ],
};
