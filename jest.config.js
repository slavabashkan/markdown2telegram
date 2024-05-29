const { transform } = require("typescript");

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [ '**/tests/*.test.ts' ],
    transform: {
        '^.+\\.tsx?$': [ 'ts-jest', { tsconfig: 'tsconfig.jest.json' } ]
    }
};