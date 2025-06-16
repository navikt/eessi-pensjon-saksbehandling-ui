module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: [
    '<rootDir>'
  ],
  modulePaths: [
    '<rootDir>'
  ],
  testMatch: [
    '<rootDir>/src/actions/?(*.)+(spec|test).+(ts|tsx)',
    '<rootDir>/src/reducers/?(*.)+(spec|test).+(ts|tsx)',
    '<rootDir>/src/utils/?(*.)+(spec|test).+(ts|tsx)',
    '<rootDir>/src/applications/P5000/?(*.)+(spec|test).+(ts|tsx)',
    '<rootDir>/src/applications/BUC/BUCUtils/?(*.)+(spec|test).+(ts|tsx)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleDirectories: [
    'node_modules'
  ],
  moduleNameMapper: {
    '^.+\\.(jpg|jpeg|png|gif|svg|css|less)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.tsx'
  ],
  coverageThreshold: {
    'global': {
      'branches': 90,
      'functions': 90,
      'lines': 90,
      'statements': 90
    },
    'src/actions': {
      'branches': 100,
      'functions': 100,
      'lines': 100,
      'statements': 100
    }
  },
  collectCoverageFrom: [
    'src/actions/*.{ts,tsx}',
    'src/applications/**/*.{ts,tsx}',
    'src/components/**/*.{ts,tsx}',
    'src/pages/**/*.{ts,tsx}',
    'src/reducers/*.{ts,tsx}',
    'src/utils/*.{ts,tsx}',
  ]
}
