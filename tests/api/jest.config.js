/**
 * Jest configuration for API tests
 */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '../../',
  roots: ['<rootDir>/tests/api'],
  testMatch: [
    '**/tests/api/**/*.test.ts'
  ],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        moduleResolution: 'node',
      }
    }]
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/api/setup.ts'],
  testTimeout: 30000,
  collectCoverageFrom: [
    'src/app/api/**/*.ts',
    '!src/app/api/**/*.test.ts',
    '!src/app/api/**/route.ts',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  globals: {
    'ts-jest': {
      isolatedModules: true,
    }
  }
};