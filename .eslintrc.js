module.exports = {
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  extends: [
    '@myparcel/eslint-config/preset-vue',
  ],
  rules: {
    'no-console': "error",
    'jsdoc/no-undefined-types': [
      'warn', {
        definedTypes: [
          'MyParcel',
          'MyParcelDeliveryOptions',
          'Wrapper',
        ],
      },
    ],
  },
};
