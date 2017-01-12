var evently = require('../index')
var sinon = require('sinon')
var expect = require('expect.js')

/**
 * @type {evently}
 */
var bus
var eventName = 'some event'
var eventValue = 'some value'
var spy1, spy2

beforeEach(function () {
    bus = evently.create()
    spy1 = sinon.spy()
    spy2 = sinon.spy()
})
it('registers a function', function (done) {
    var expected = [{ max: Infinity, executed: 0, handler: spy1 }]
    expect(bus.info(eventName).handlers).to.eql([])
    bus.on(eventName, spy1)
    expect(bus.info(eventName).handlers).to.eql(expected)
    done()
})
it('registering a non function throws', function (done) {
    expect(function () {
        bus.on(eventName)
    }).to.throwException(/handler has to be defined and has to be a function/)
    done()
})
it('can\'t register a handler twice', function (done) {
    expect(bus.info(eventName).length).to.be(0)
    bus.on(eventName, spy1)
    expect(bus.info(eventName).length).to.be(1)
    bus.on(eventName, spy1)
    expect(bus.info(eventName).length).to.be(1)
    done()
})
it('unregisters a function', function (done) {
    var expected = [{ max: Infinity, executed: 0, handler: spy1 }]
    expect(bus.info(eventName).handlers).to.eql([])
    bus.on(eventName, spy1)
    expect(bus.info(eventName).handlers).to.eql(expected)
    bus.off(eventName, spy1)
    expect(bus.info(eventName).handlers).to.eql([])
    done()
})
it('unregisters nothing if the function does not exist', function (done) {
    var expected = [{ max: Infinity, executed: 0, handler: spy1 }]
    expect(bus.info(eventName).handlers).to.eql([])
    bus.on(eventName, spy1)
    expect(bus.info(eventName).handlers).to.eql(expected)
    bus.off(eventName, spy2)
    expect(bus.info(eventName).handlers).to.eql(expected)
    done()
})
it('unregisters nothing if the event does not exist', function (done) {
    expect(bus.info(eventName).exists).to.be(false)
    bus.off(eventName, spy1)
    expect(bus.info(eventName).exists).to.be(false)
    done()
})
it('triggers handler', function (done) {
    bus.on(eventName, function (event) {
        expect(eventValue).to.be(event)
        done()
    })
    expect(bus.trigger(eventName, eventValue)).to.be(true)
})
it('triggers nothing if the event does not exist', function (done) {
    bus.trigger(eventName, eventValue)
    done()
})
it('can mix into another object', function (done) {
    var obj = { test: 'value' }
    bus.mixin(obj)
    expect(obj).to.eql({
        test: 'value',
        _handlers: {},
        on: bus.on,
        off: bus.off,
        trigger: bus.trigger,
        mixin: bus.mixin,
        create: bus.create,
        info: bus.info,
        many: bus.many,
        once: bus.once
    })
    done()
})
it('executes only once', function (done) {
    var expected = [{ max: 1, executed: 0, handler: spy1 }]
    expect(bus.info(eventName).handlers).to.eql([])
    bus.once(eventName, spy1)
    expect(bus.info(eventName).handlers).to.eql(expected)
    bus.trigger(eventName)
    expect(bus.info(eventName).handlers).to.eql([])
    bus.trigger(eventName)
    done()
})
it('executes only twice', function (done) {
    var expected1 = [{ max: 2, executed: 0, handler: spy1 }]
    var expected2 = [{ max: 2, executed: 1, handler: spy1 }]
    expect(bus.info(eventName).handlers).to.eql([])
    bus.many(eventName, 2, spy1)
    expect(bus.info(eventName).handlers).to.eql(expected1)
    bus.trigger(eventName)
    expect(bus.info(eventName).handlers).to.eql(expected2)
    bus.trigger(eventName)
    expect(bus.info(eventName).handlers).to.eql([])
    bus.trigger(eventName)
    done()
})
it('many throws if amount is finite and below 0', function (done) {
    expect(function () { bus.many(eventName, 0, spy1) }).to.throwException(/amount has to be defined and be higher than 0/)
    done()
})
