export default {
  preset: "ts-jest",
  testEnvironment: 'jest-fixed-jsdom',
  extensionsToTreatAsEsm: ['.tsx'],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.app.json",
      },
    ],
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/test/__mocks__/fileMock.js",
    "\\.(gif|ttf|eot|svg|png|jpg)$": "<rootDir>/test/__mocks__/fileMock.js",
  },
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
  ],
};