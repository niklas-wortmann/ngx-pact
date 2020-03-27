module.exports = {
  testMatch: ['**/+(*.)+(test).+(ts|js)'],
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageReporters: ['html'],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 60,
      lines: 75,
      statements: 75
    }
  }
};
