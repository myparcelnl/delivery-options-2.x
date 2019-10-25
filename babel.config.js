module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'intl', {
        messagesDir: './build/messages/',
        enforceDescriptions: true,
      },
    ],
  ],
};
