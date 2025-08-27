/**
 * Jest configuration for API tests
 */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/api'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
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
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/api/setup.ts'],
  testTimeout: 30000,
  collectCoverageFrom: [
    'src/app/api/**/*.ts',
    '!src/app/api/**/*.test.ts',
    '!src/app/api/**/route.ts', // Next.js route handlers
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  globals: {
    'ts-jest': {
      isolatedModules: true,
    }
  }
};