const { Brev, reflect, createBus } = require('../')
const sinon = require('sinon')
const expect = require('expect.js')

let bus
const eventName = 'some event'
const eventValue = 'some value'
let spy1, spy2

beforeEach(function () {
    bus = createBus()
    spy1 = sinon.spy()
    spy2 = sinon.spy()
})
it('registers a function', () => {
    let expected = [{ max: Infinity, executed: 0, listener: spy1 }]
    expect(reflect(bus, eventName)).to.eql([])
    bus.on(eventName, spy1)
    expect(reflect(bus, eventName)).to.eql(expected)
})
it('unregisters a function', () => {
    let expected = [{ max: Infinity, executed: 0, listener: spy1 }]
    expect(reflect(bus, eventName)).to.eql([])
    bus.on(eventName, spy1)
    expect(reflect(bus, eventName)).to.eql(expected)
    bus.off(eventName, spy1)
    expect(reflect(bus, eventName)).to.eql([])
})
it('can\'t register a handler twice', () => {
    expect(reflect(bus, eventName).length).to.be(0)
    bus.on(eventName, spy1)
    expect(reflect(bus, eventName).length).to.be(1)
    bus.on(eventName, spy1)
    expect(reflect(bus, eventName).length).to.be(1)
})
it('unregisters nothing if the function does not exist', function (done) {
    var expected = [{ max: Infinity, executed: 0, fn: spy1 }]
    expect(brev.reflect(bus, eventName).handlers).to.eql([])
    bus.on(eventName, spy1)
    expect(brev.reflect(bus, eventName).handlers).to.eql(expected)
    bus.off(eventName, spy2)
    expect(brev.reflect(bus, eventName).handlers).to.eql(expected)
    done()
})
it('unregisters nothing if the event does not exist', function (done) {
    expect(brev.reflect(bus, eventName).exists).to.be(false)
    bus.off(eventName, spy1)
    expect(brev.reflect(bus, eventName).exists).to.be(false)
    done()
})
it('triggers handler', function (done) {
    bus.on(eventName, function (event) {
        expect(eventValue).to.be(event)
        done()
    })
    bus.emit(eventName, eventValue)
})
it('triggers nothing if the event does not exist', function (done) {
    bus.emit(eventName, eventValue)
    done()
})
it('can mix into another object', function (done) {
    var obj = { test: 'value' }
    bus.mixin(obj)
    expect(obj).to.eql({
        test: 'value',
        __handlers__: {},
        on: bus.on,
        off: bus.off,
        emit: bus.emit,
        mixin: bus.mixin,
        many: bus.many,
        once: bus.once
    })
    done()
})
it('executes only once', function (done) {
    var expected = [{ max: 1, executed: 0, fn: spy1 }]
    expect(brev.reflect(bus, eventName).handlers).to.eql([])
    bus.once(eventName, spy1)
    expect(brev.reflect(bus, eventName).handlers).to.eql(expected)
    bus.emit(eventName)
    setTimeout(function () {
        expect(brev.reflect(bus, eventName).handlers).to.eql([])
        bus.emit(eventName)
    }, 10)
    setTimeout(function () {
        expect(brev.reflect(bus, eventName).handlers).to.eql([])
        done()
    }, 20)
})
it('executes only twice', function (done) {
    var expected1 = [{ max: 2, executed: 0, fn: spy1 }]
    var expected2 = [{ max: 2, executed: 1, fn: spy1 }]
    expect(brev.reflect(bus, eventName).handlers).to.eql([])
    bus.many(eventName, 2, spy1)
    expect(brev.reflect(bus, eventName).handlers).to.eql(expected1)
    bus.emit(eventName)

    setTimeout(function () {
        expect(brev.reflect(bus, eventName).handlers).to.eql(expected2)
        bus.emit(eventName)
    }, 10)
    setTimeout(function () {
        expect(brev.reflect(bus, eventName).handlers).to.eql([])
        bus.emit(eventName)
    }, 20)
    setTimeout(function () {
        expect(brev.reflect(bus, eventName).handlers).to.eql([])
        done()
    }, 30)
})
it('many throws if amount is finite and below 0', function (done) {
    expect(function () { bus.many(eventName, 0, spy1) }).to.throwException(/amount has to be defined and be higher than 0/)
    done()
})
