module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.jsx?$': '<rootDir>/node_modules/babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(babel-jest|jest-vue-preprocessor)/)'],
  moduleNameMapper: {
    '/myparcel-js-sdk(?:/.+)+?$': '<rootDir>/tests/__mocks__/myparcel-js-sdk.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  snapshotSerializers: ['jest-serializer-vue'],
  testMatch: [
    '<rootDir>/tests/unit/**/*.spec.(js|jsx|ts|tsx)',
  ],
  testURL: 'http://localhost/',
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    '!**/node_modules/**',
    '!<rootDir>/demo/**',
    '!<rootDir>/dist/**',
    '!<rootDir>/myparcel-js-sdk/**',
    '!<rootDir>/sandbox/**',
    '!<rootDir>/tests/**',
    '<rootDir>/src/**/*.{js}',
    '<rootDir>/src/**/*.{vue}',
  ],
  coverageReporters: ['lcov', 'text-summary'],
};
