'use strict'
/* global beforeEach it expect jest brev */

const createBus = require('../')

const puppeteer = require('puppeteer')

let bus = createBus()
const eventName = 'some event'
const eventValue = 'some value'
let mock1 = jest.fn(),
    mock2 = jest.fn()

beforeEach(() => {
  bus = createBus()
  mock1 = jest.fn()
  mock2 = jest.fn()
})
// ON
it('registers a function', () => {
  let expected = [mock1]
  expect(bus.reflect(eventName)).toEqual([])
  bus.on(eventName, mock1)
  expect(bus.reflect(eventName)).toEqual(expected)
})
it('unregisters a function', () => {
  let expected = [mock1]
  expect(bus.reflect(eventName)).toEqual([])
  bus.on(eventName, mock1)
  expect(bus.reflect(eventName)).toEqual(expected)
  bus.off(eventName, mock1)
  expect(bus.reflect(eventName)).toEqual([])
})
it('can\'t register a handler twice', () => {
  expect(bus.reflect(eventName).length).toBe(0)
  bus.on(eventName, mock1)
  expect(bus.reflect(eventName).length).toBe(1)
  bus.on(eventName, mock1)
  expect(bus.reflect(eventName).length).toBe(1)
})
it('unregisters nothing if the function does not exist', () => {
  let expected = [mock1]
  expect(bus.reflect(eventName)).toEqual([])
  bus.on(eventName, mock1)
  expect(bus.reflect(eventName)).toEqual(expected)
  bus.off(eventName, mock2)
  expect(bus.reflect(eventName)).toEqual(expected)
})
it('unregisters nothing if the event does not exist', () => {
  expect(bus.reflect(eventName).length).toBe(0)
  bus.off(eventName, mock1)
  expect(bus.reflect(eventName).length).toBe(0)
})
it('triggers handler', done => {
  bus.on(eventName, event => {
    expect(eventValue).toBe(event)
    done()
  })
  bus.emit(eventName, eventValue)
})
it('does nothing if the event does not exist', () => {
  bus.emit(eventName, eventValue)
})
it('once registers a function', () => {
  expect(bus.reflect(eventName).length).toBe(0)
  bus.once(eventName, mock1)
  expect(bus.reflect(eventName).length).toBe(1)
})
it('once registers as an event', () => {
  expect(bus.reflect(eventName).length).toBe(0)
  bus.once(eventName)
  expect(bus.reflect(eventName).length).toBe(1)
})
it('once executes with function registered', function (done) {
  bus.once(eventName, function (event) {
    expect(event).toBe(eventValue)
    done()
  })
  bus.emit(eventName, eventValue)
})
it('once executes with with no function specified', done => {
  bus.once(eventName).then(mock1).then(() => {
    expect(mock1.mock.calls.length).toBe(1)
    expect(mock1.mock.calls[0][0]).toBe(eventValue)
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
  expect(bus.reflect(eventName).length).toBe(0)
  bus.many(eventName, 2, mock1)
  expect(bus.reflect(eventName).length).toBe(1)
})
it('many executes a function correctly ', () => {
  bus.many(eventName, 2, mock1)
  expect(mock1.mock.calls.length).toBe(0)
  expect(bus.reflect(eventName).length).toEqual(1)
  bus.emit(eventName)
  expect(mock1.mock.calls.length).toBe(1)
  expect(bus.reflect(eventName).length).toEqual(1)
  bus.emit(eventName)
  expect(mock1.mock.calls.length).toBe(2)
  expect(bus.reflect(eventName).length).toEqual(0)
  bus.emit(eventName)
})
it("many max cannot be below or equal to 0", () => {
  expect(() => bus.many(eventName, 0, () => {})).toThrow(/max must be above 0/)
  expect(() => bus.many(eventName, -1, () => {})).toThrow(/max must be above 0/)
  expect(() => bus.many(eventName, -1000, () => {})).toThrow(/max must be above 0/)
})
it("cannot register with a empty event string", () => {
  expect(() => bus.many("", 1, () => {})).toThrow(/event must me something/)
  expect(() => bus.on("", 1, () => {})).toThrow(/event must me something/)
  expect(bus.once("", 1, () => {})).rejects.toThrow(/event must me something/)
})
it("cannot register on event that is not a string", () => {
  expect(() => bus.many(1, 1, () => {})).toThrow(/event must me something/)
  expect(() => bus.many(null, 1, () => {})).toThrow(/event must me something/)
  expect(() => bus.many(true, 1, () => {})).toThrow(/event must me something/)
  expect(() => bus.many(() => {}, 1, () => {})).toThrow(/event must me something/)
  expect(() => bus.many(void 0, 1, () => {})).toThrow(/event must me something/)
  expect(() => bus.many(null, 1, () => {})).toThrow(/event must me something/)
  expect(() => bus.on(1, 1, () => {})).toThrow(/event must me something/)
  expect(() => bus.on(null, 1, () => {})).toThrow(/event must me something/)
  expect(() => bus.on(true, 1, () => {})).toThrow(/event must me something/)
  expect(() => bus.on(() => {}, 1, () => {})).toThrow(/event must me something/)
  expect(() => bus.on(void 0, 1, () => {})).toThrow(/event must me something/)
  expect(() => bus.on(null, 1, () => {})).toThrow(/event must me something/)
  expect(bus.once(1, 1, () => {})).rejects.toThrow(/event must me something/)
  expect(bus.once(null, 1, () => {})).rejects.toThrow(/event must me something/)
  expect(bus.once(true, 1, () => {})).rejects.toThrow(/event must me something/)
  expect(bus.once(() => {}, 1, () => {})).rejects.toThrow(/event must me something/)
  expect(bus.once(void 0, 1, () => {})).rejects.toThrow(/event must me something/)
  expect(bus.once(null, 1, () => {})).rejects.toThrow(/event must me something/)
})
it("cannot register a listener that is not a function", () => {
  expect(bus.reflect(eventName).length).toBe(0)
  bus.on(eventName, 1)
  bus.on(eventName, true)
  bus.on(eventName, false)
  bus.on(eventName, "not a function")
  bus.on(eventName, void 0)
  bus.on(eventName, null)
  expect(bus.reflect(eventName).length).toBe(0)
})
it("can be mixed into other objects", () => {
  let myObject = { hello: "world" }
  let myNewObject = bus.mixin(myObject)
  expect(myNewObject.hello).toBe(myObject.hello)
  expect(typeof myNewObject.on).toBe('function')
  expect(typeof myNewObject.once).toBe('function')
  expect(typeof myNewObject.many).toBe('function')
  expect(typeof myNewObject.off).toBe('function')
  expect(typeof myNewObject.emit).toBe('function')
  expect(typeof myNewObject.mixin).toBe('function')
})

it('events can be observed', () => {
  expect(bus.observe(eventName)).toBeDefined()
})
it('observed events gets called', () => {
  bus.observe(eventName).run(mock1)
  expect(mock1).not.toBeCalled()
  bus.emit(eventName, eventValue)
  expect(mock1).toBeCalled()
})
it('events can be observed and filtered', () => {
  bus.observe(eventName).filter(mock1.mockReturnValue(false).mockReturnValueOnce(true)).run(mock2)
  bus.emit(eventName, eventValue)
  bus.emit(eventName, eventValue)
  expect(mock1.mock.calls).toEqual([[eventValue], [eventValue]])
  expect(mock2.mock.calls).toEqual([[eventValue]])
})
it('events can be observed and mapped to new values', () => {
  bus.observe(eventName).map(mock1.mockReturnValue(eventValue+eventValue).mockReturnValueOnce(eventValue.toLowerCase())).run(mock2)
  bus.emit(eventName, eventValue)
  bus.emit(eventName, eventValue)
  expect(mock1.mock.calls).toEqual([[eventValue], [eventValue]])
  expect(mock2.mock.calls).toEqual([[eventValue.toLowerCase()], [eventValue+eventValue]])
})
it('observers can unregister themselves', () => {
  var observer = bus.observe(eventName).run(mock1)
  bus.emit(eventName, eventValue)
  expect(mock1).toHaveBeenCalledTimes(1)
  observer.unobserve()
  bus.emit(eventName, eventValue)
  expect(mock1).toHaveBeenCalledTimes(1)
})

it('evaluates in browser', async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.addScriptTag({ path: './index.js' })
  expect(page.evaluate(() => {
    return brev.name
  })).resolves.toBe('createBus')
})
