module.exports = {
  presets: ['@vue/app'],
  plugins: [
    [
      'intl', {
        messagesDir: './build/messages/',
        enforceDescriptions: true,
      },
    ],
  ],
};
