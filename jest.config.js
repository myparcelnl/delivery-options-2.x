const fs = require('fs');
const path = require('path');
const sdkPath = path.dirname(__dirname);

let sdkMock = {};

try {
  // Use the sdk if it is present (local)
  if (fs.existsSync(sdkPath)) {
    sdkMock = { '^@myparcel/sdk(?:/.+)+?$': '<rootDir>/myparcel-js-sdk' };
  }
} catch (err) {
  // Mock until sdk is live on npm
  sdkMock = { '^@myparcel/sdk(?:/.+)+?$': '<rootDir>/tests/__mocks__/myparcel-js-sdk.js' };
}

module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.jsx?$': '<rootDir>/node_modules/babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(babel-jest|jest-vue-preprocessor)/)'],
  moduleNameMapper: {
    ...sdkMock,
    '^@/(.*)$': '<rootDir>/src/$1',
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
