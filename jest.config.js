/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  collectCoverage: true,
  verbose: true,
  coverageThreshold: {
    global: {
      lines: 90,
    },
  },
};
