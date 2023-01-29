/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  globals: {
    "ts-jest": {
      tsconfig: "./tsconfig.json",
    },
  },
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./src/jest.setup.ts"],
};
