module.exports = {
    preset: 'jest-preset-angular',
    testMatch: ['**/+(*.)+(spec).(pact).(ts)'],
    testURL: 'http://localhost:<%= port %>',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
};