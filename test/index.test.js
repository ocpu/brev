require('tap').mochaGlobals()
const { reflect, createBus } = require('../')
const sinon = require('sinon')
const expect = require('expect.js')

let bus
const eventName = 'some event'
const eventValue = 'some value'
let spy1, spy2

beforeEach(() => {
    bus = createBus()
    spy1 = sinon.spy()
    spy2 = sinon.spy()
})
it('registers a function', () => {
    let expected = [{
        max: Infinity,
        executed: 0,
        listener: spy1
    }]
    expect(reflect(bus, eventName)).to.eql([])
    bus.on(eventName, spy1)
    expect(reflect(bus, eventName)).to.eql(expected)
})
it('unregisters a function', () => {
    let expected = [{
        max: Infinity,
        executed: 0,
        listener: spy1
    }]
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
it('unregisters nothing if the function does not exist', () => {
    let expected = [{
        max: Infinity,
        executed: 0,
        listener: spy1
    }]
    expect(reflect(bus, eventName)).to.eql([])
    bus.on(eventName, spy1)
    expect(reflect(bus, eventName)).to.eql(expected)
    bus.off(eventName, spy2)
    expect(reflect(bus, eventName)).to.eql(expected)
})
it('unregisters nothing if the event does not exist', () => {
    expect(reflect(bus, eventName).length).to.be(0)
    bus.off(eventName, spy1)
    expect(reflect(bus, eventName).length).to.be(0)
})
it('triggers handler', done => {
    bus.on(eventName, event => {
        expect(eventValue).to.be(event)
        done()
    })
    bus.emit(eventName, eventValue)
})
it('deos nothing if the event does not exist', () => {
    bus.emit(eventName, eventValue)
})
it('once registers a function', () => {
    expect(reflect(bus, eventName).length).to.be(0)
    bus.once(eventName, spy1)
    expect(reflect(bus, eventName).length).to.be(1)
})
it('once registers as an event', () => {
    expect(reflect(bus, eventName).length).to.be(0)
    bus.once(eventName)
    expect(reflect(bus, eventName).length).to.be(1)
})
it('once executes with function registered', () => {
    bus.once(eventName, spy1)
    bus.emit(eventName, eventValue)
    expect(spy1.args[0][0]).to.be(eventValue)
})
it('once executes with with no function specified', done => {
    bus.once(eventName).then(spy1).then(() => {
        expect(spy1.args[0][0]).to.be(eventValue)
        done()
    })
    bus.emit(eventName, eventValue)
})
it('many registers a function', () => {
    expect(reflect(bus, eventName).length).to.be(0)
    bus.many(eventName, 2, spy1)
    expect(reflect(bus, eventName).length).to.be(1)
})
it('many executes a function correctly ', () => {
    bus.many(eventName, 2, spy1)
    bus.emit(eventName)

    expect(spy1.callCount).to.be(1)
    expect(reflect(bus, eventName)[0].executed).to.eql(1)
    bus.emit(eventName)
    expect(spy1.callCount).to.be(2)
    expect(reflect(bus, eventName)).to.eql([])
    bus.emit(eventName)
})