const path = require('path');

module.exports = {
  rootDir: 'src',
  clearMocks: true,
  coveragePathIgnorePatterns: ['/node_modules/', path.join(__dirname, 'build')],
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^src(.*)$': path.resolve(__dirname, 'src$1'),
  },
  testEnvironment: 'node',
  testMatch: ['tests/**/*.test.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  verbose: true,
};
