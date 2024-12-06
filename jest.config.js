export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  globalTeardown: "./src/tests/teardown.js",
};
