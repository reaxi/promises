/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */

require('jsonc-require');
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/src/data'],
    rootDir: './src',
    roots: ['../tests/'],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/',
    }),
    transform: {
        '^.+\\.(t|j)sx?$': '@swc/jest',
    },
    clearMocks: true,
    setupFilesAfterEnv: ['../jest.setup.js'],
};
