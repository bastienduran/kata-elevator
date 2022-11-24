const config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testEnvironment: "node",
  testRegex: ".*\\.(e2e-spec|spec|test).(ts|tsx|js)$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx+,tsx,ts}",
    "!src/**/*.spec.{js,jsx,tsx,ts}",
    "!src/**/*.spec/*.{js,jsx,tsx,ts}",
    "!**/node_modules/**",
    "!**/vendor/**",
  ],
  coverageDirectory: "coverage/unit",
  testTimeout: 10000,
};

module.exports = config;
