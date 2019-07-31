module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.jsx?$': '<rootDir>/node_modules/babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(babel-jest|jest-vue-preprocessor)/)'],
  moduleNameMapper: {
    '^Sdk/(.*)$': '<rootDir>/myparcel-js-sdk/$1',
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
    '**/*.{vue}',
    '!**/node_modules/**',
    '!<rootDir>/dist/**',
    '!<rootDir>/src/vendor/**',
    '!<rootDir>/tests/**',
    '!<rootDir>/myparcel-js-sdk/**',
    '!<rootDir>/sandbox/**',
  ],
  coverageReporters: ['lcov', 'text-summary'],
};
