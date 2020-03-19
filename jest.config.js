module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!('
    + 'babel-jest|'
    + 'bootstrap-vue|'
    + 'jest-vue-preprocessor|'
    + 'lodash-es'
    + ')/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^!?raw-loader!(.*)': '<rootDir>/tests/__mocks__/rawLoader.js',
  },
  snapshotSerializers: ['jest-serializer-vue'],
  testMatch: [
    '<rootDir>/tests/unit/**/*.spec.(js|jsx|ts|tsx)',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/jest-setup'],
  testURL: 'http://localhost/',
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,vue}',
  ],
  coverageReporters: ['lcov', 'text-summary'],
};
