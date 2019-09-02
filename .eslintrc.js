module.exports = {
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
};
