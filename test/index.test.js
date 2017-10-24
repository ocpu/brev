require('tap').mochaGlobals()
const sinon = require('sinon')
const expect = require('expect.js')
const { createBus } = require('../')

let bus = createBus()
const eventName = 'some event'
const eventValue = 'some value'
let spy1 = sinon.spy(),
    spy2 = sinon.spy()

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
    expect(bus.reflect(eventName)).to.eql([])
    bus.on(eventName, spy1)
    expect(bus.reflect(eventName)).to.eql(expected)
})
it('unregisters a function', () => {
    let expected = [{
        max: Infinity,
        executed: 0,
        listener: spy1
    }]
    expect(bus.reflect(eventName)).to.eql([])
    bus.on(eventName, spy1)
    expect(bus.reflect(eventName)).to.eql(expected)
    bus.off(eventName, spy1)
    expect(bus.reflect(eventName)).to.eql([])
})
it('can\'t register a handler twice', () => {
    expect(bus.reflect(eventName).length).to.be(0)
    bus.on(eventName, spy1)
    expect(bus.reflect(eventName).length).to.be(1)
    bus.on(eventName, spy1)
    expect(bus.reflect(eventName).length).to.be(1)
})
it('unregisters nothing if the function does not exist', () => {
    let expected = [{
        max: Infinity,
        executed: 0,
        listener: spy1
    }]
    expect(bus.reflect(eventName)).to.eql([])
    bus.on(eventName, spy1)
    expect(bus.reflect(eventName)).to.eql(expected)
    bus.off(eventName, spy2)
    expect(bus.reflect(eventName)).to.eql(expected)
})
it('unregisters nothing if the event does not exist', () => {
    expect(bus.reflect(eventName).length).to.be(0)
    bus.off(eventName, spy1)
    expect(bus.reflect(eventName).length).to.be(0)
})
it('triggers handler', done => {
    bus.on(eventName, event => {
        expect(eventValue).to.be(event)
        done()
    })
    bus.emit(eventName, eventValue)
})
it('does nothing if the event does not exist', () => {
    bus.emit(eventName, eventValue)
})
it('once registers a function', () => {
    expect(bus.reflect(eventName).length).to.be(0)
    bus.once(eventName, spy1)
    expect(bus.reflect(eventName).length).to.be(1)
})
it('once registers as an event', () => {
    expect(bus.reflect(eventName).length).to.be(0)
    bus.once(eventName)
    expect(bus.reflect(eventName).length).to.be(1)
})
it('once executes with function registered', done => {
    bus.once(eventName, event => {
        expect(eventValue).to.be(event)
        done()
    })
    bus.emit(eventName, eventValue)
})
it('once executes with with no function specified', done => {
    bus.once(eventName).then(spy1).then(() => {
        expect(spy1.args[0][0]).to.be(eventValue)
        done()
    })
    bus.emit(eventName, eventValue)
})
it('once listener can throw and get caught in promise', done => {
    bus.once(eventName, () => {
        throw new Error
    }).then(done, () => {
        done()
    })
    bus.emit(eventName, eventValue)
})
it('many registers a function', () => {
    expect(bus.reflect(eventName).length).to.be(0)
    bus.many(eventName, 2, spy1)
    expect(bus.reflect(eventName).length).to.be(1)
})
it('many executes a function correctly ', () => {
    bus.many(eventName, 2, spy1)
    bus.emit(eventName)

    expect(spy1.callCount).to.be(1)
    expect(bus.reflect(eventName)[0].executed).to.eql(1)
    bus.emit(eventName)
    expect(spy1.callCount).to.be(2)
    expect(bus.reflect(eventName)).to.eql([])
    bus.emit(eventName)
})
it("many max cannot be below or equal to 0", () => {
    expect(bus.reflect(eventName).length).to.be(0)
    bus.many(eventName, 0, () => {})
    bus.many(eventName, -1, () => {})
    bus.many(eventName, -1000, () => {})
    expect(bus.reflect(eventName).length).to.be(0)
})
it("cannot register with a empty event string", () => {
    expect(bus.reflect(eventName).length).to.be(0)
    bus.many("", 1, () => {})
    expect(bus.reflect(eventName).length).to.be(0)
})
it("cannot register on event that is not a string", () => {
    expect(bus.reflect(eventName).length).to.be(0)
    bus.many(1, 1, () => {})
    bus.many(true, 1, () => {})
    bus.many(false, 1, () => {})
    bus.many(() => {}, 1, () => {})
    bus.many(void 0, 1, () => {})
    bus.many(null, 1, () => {})
    expect(bus.reflect(eventName).length).to.be(0)
})
it("cannot register a listener that is not a function", () => {
    expect(bus.reflect(eventName).length).to.be(0)
    bus.many(eventName, 1, 1)
    bus.many(eventName, 1, true)
    bus.many(eventName, 1, false)
    bus.many(eventName, 1, "not a function")
    bus.many(eventName, 1, void 0)
    bus.many(eventName, 1, null)
    expect(bus.reflect(eventName).length).to.be(0)
})
it("can be mixed into other objects", () => {
    let myObject = { hello: "world" }
    let myNewObject = bus.mixin(myObject)
    expect(myNewObject.hello).to.be(myObject.hello)
    expect(myNewObject.on).to.a("function")
    expect(myNewObject.once).to.a("function")
    expect(myNewObject.many).to.a("function")
    expect(myNewObject.off).to.a("function")
    expect(myNewObject.emit).to.a("function")
    expect(myNewObject.mixin).to.a("function")
    expect(myNewObject).to.not.be(myObject)
})