module.exports = {
  testMatch: ['**/+(*.)+(test).+(ts|js)'],
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageReporters: ['html'],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 54,
      lines: 60,
      statements: 60
    }
  }
};
