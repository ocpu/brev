'use strict'

const createBus = (() => {

const listeners = Symbol("listeners")
const func = Symbol("func")
const using = Symbol("using")
const execute = Symbol("execute")
const init = Symbol("init")

const isBrowser = typeof window !== 'undefined'
const supportsServiceWorker = typeof ServiceWorkerRegistration !== 'undefined'
const supportsWorker = typeof Worker !== 'undefined'
const supportsChildProcess = typeof require !== 'undefined' && typeof require('child_process') !== 'undefined'

// if (isBrowser && window.)

class EventStream {
  constructor(bus, event, _) {
    this.invoke = this.invoke.bind(this)
    this._bus = bus
    this._event = event
    this[init] = _||this.invoke
  }

  [execute]() {
    if (this[func] !== void 0)
      throw new Error("stream has already been operated upon")
    return new EventStream(this._bus, this._event, this[init])
  }

  invoke(e) {
    this[func](e)
  }

  map(mapper) {
    const stream = this[execute]()
    this[func] = it => stream.invoke(mapper(it))
    return stream
  }

  filter(predicate) {
    const stream = this[execute]()
    this[func] = it => predicate(it)&&stream.invoke(it)
    return stream
  }

  forEach(action) {
    const stream = this[execute]()
    this[func] = it => action(it)
    return stream
  }

  peek(action) {
    const stream = this[execute]()
    this[func] = it => (void action(it))||stream.invoke(it)
    return stream
  }

  combine(other) {
    const stream = this[execute]()
    this.forEach(stream.invoke)
    other.forEach(stream.invoke)
    return stream
  }

  skip(n) {
    var times = n
    const stream = this[execute]()
    this[func] = it => times === 0 ? stream.invoke(it) : times--
    return stream
  }

  stop() {
    off(this._bus[listeners], this._event, this[init])
  }
}

const _on1 = (listeners, event, listener) => void(listeners[event] = [listener])
const _on2 = (listeners, event, listener) => void listeners[event].push(listener)
const listenerExists = (listeners, event, listener) => ~listeners[event].indexOf(listener)
const on = (listeners, event, listener) => 
  event in listeners ? listenerExists(listeners, event, listener) ? void 0 : _on2(listeners, event, listener) : _on1(listeners, event, listener)
const onPrecondisions = (listeners, event, listener) => {
  if (typeof event !== 'string' || !event)
    throw new Error("event must be something")
  if (typeof listener !== 'function')
    return
  on(listeners, event, listener)
}
const _off = (listeners, event, index) => void listeners[event].splice(index, 1)
const off = (listeners, event, listener) => {
  if (!(event in listeners)) return
  const index = listeners[event].indexOf(listener)
  if (index === -1) return
  _off(listeners, event, index)
}
const many = (listeners, event, max, listener) => {
  let calls = 0
  const many = e => {
    listener(e)
    if (calls+1 === max)
      off(listeners, event, many)
    calls++
  }
  onPrecondisions(listeners, event, many)
}
const mixin = bus => ({get: (target, key) => key in bus || key === listeners ? bus[key] : target[key]})
const message = (event, data) => ({__brev:true,event,data})

const createBus = () => ({
  [listeners]: {},
  [using]: [],
  on(event, listener) {
    onPrecondisions(this[listeners], event, listener)
    return this
  },
  once(event, listener) {
    return new Promise((resolve, reject) => {
      try {
        const once = e => {
          try {
            this.off(event, once)
            resolve(listener?listener(e):e)
          } catch (e) {
            reject(e)
          }
        }
        this.on(event, once)
      } catch (e) {
        reject(e)
      }
    })
  },
  many(event, max, listener) {
    if (max < 1)
      throw Error('max must be above 0')
    many(this[listeners], event, max, listener)
  },
  off(event, listener) {
    off(this[listeners], event, listener)
  },
  emit(event, data) {
    for (const listener of this.listeners(event)) listener(data)
    if (!this[using].length) return
    if (isBrowser) for (const worker of this[using]) worker.postMessage(message(event, data))
    for (const sub of this[using]) sub.send(message(event, data))
  },
  mixin(obj) {
    return new Proxy(obj, mixin(this))
  },
  listeners(event) {
    return this[listeners][event] || []
  },
  stream(event) {
    const stream = new EventStream(this, event)
    on(this[listeners], event, stream.invoke)
    return stream
  },
  use(worker) {
    if ((supportsServiceWorker && worker instanceof ServiceWorker) ||
        (supportsWorker && worker instanceof Worker)) {
      worker.postMessage(message('__register__'))
      worker.addEventListener('message', e => e.data&&e.data.__brev&&this.emit(e.data.event, e.data.data))
      this[using].push(worker)
    }
    else if (supportsChildProcess && worker instanceof (require('child_process').ChildProcess)) {
      worker.send(message('__register__'))
      this[using].push(worker)
    }
    else if (worker === void 0) {
      addEventListener('message', () => {
        // if (e.data&&e.data.__brev) e.source.
      })
    }
  }
})
return createBus().mixin(createBus)
})()

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
  module.exports = createBus
