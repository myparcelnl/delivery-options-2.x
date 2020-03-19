module.exports = {
  ignore: [/node_modules\/(?!lodash-es|bootstrap-vue)/],
  presets: [
    '@vue/app',
  ],
  plugins: [
    [
      'intl', {
        messagesDir: './build/messages/',
        enforceDescriptions: true,
      },
    ],
  ],
  env: {
    webpack: {
      presets: [
        [
          '@babel/env',
          {
            targets: {
              node: 'current',
            },
            modules: 'commonjs',
          },
        ],
      ],
    },
  },
};
