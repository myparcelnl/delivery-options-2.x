module.exports = {
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  extends: [
    '@myparcel/eslint-config/preset-vue',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'development' ? 'warn' : 'error',
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
