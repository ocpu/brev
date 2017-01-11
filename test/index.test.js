var evently = require('../index')
var sinon = require('sinon')
var expect = require('expect.js')

describe('describe', function () {
    it('it', function (done) {
        expect(evently.on).to.be.a(Function)
        done()
    })
})