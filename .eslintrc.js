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
        definedTypes: [
          'MyParcel',
          'MyParcelDeliveryOptions',
        ],
      },
    ],
  },
};
