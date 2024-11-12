/** @type {import('ts-jest').JestConfigWithTsJest} **/

//setting test env for jest
process.env.NODE_ENV = 'test';

module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};