/* eslint-disable */

module.exports = () => ({
  files: ['./new.js'],

  tests: ['./test/index.test.js'],

  env: {
    type: 'node',
    runner: 'node'
  },

  testFramework: 'jest'
})