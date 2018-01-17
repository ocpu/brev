'use strict'
/* global clients */

var brev = (function () {

var isBrowserEnviornment = typeof window !== 'undefined' && typeof document !== 'undefined',
    supportsServiceWorker = typeof navigator !== 'undefined' && 'serviceWorker' in navigator

var observeFail = {__brev_obs:true,__observed:false}

const createBus = () => ({
  /**
   * @type {{[event:string]:Function[]}}
   * @private
   */
  _listeners: {},
  reflect: function (event) {
    return event ? this._listeners[event] || [] : this._listeners
  },
  /**
   * 
   * @param {string} event 
   */
  observe: function (event) {
    var bus = this
    var mutators = []
    var observer = function (e) {
      var obj = e
      mutators.forEach(mutator => {
        if (obj !== observeFail)
          obj = mutator(obj)
      })
    }
    this.on(event, observer)
    return {
      filter: function (perdicate) {
        mutators.push(function (obj) {
          return perdicate(obj) ? obj : observeFail
        })
        return this
      },
      map: function (mapper) {
        mutators.push(mapper)
        return this
      },
      run: function (fn) {
        mutators.push(function (obj) {
          fn(obj)
          return obj
        })
        return this
      },
      unobserve: function () {
        bus.off(event, observer)
      }
    }
  },
  on: function (event, listener) {
    if (typeof event !== "string" || (typeof event === "string" && event === ""))
      throw new Error("event must me something")
    if (typeof listener !== 'function')
      return
    if (!(event in this._listeners))
      this._listeners[event] = []
    if (!~this._listeners[event].indexOf(listener))
      this._listeners[event].push(listener)
    return this
  },
  once: function (event, listener) {
    return new Promise((resolve, reject) => {
      this.on(event, function onceFn(e) {
        this.off(event, onceFn)
        try {
          resolve(listener ? listener(e) : e)
        } catch (e) {
          reject(e)
        }
      }.bind(this))
    })
  },
  many: function (event, max, listener) {
    if (max < 1)
      throw Error('max must be above 0')
    var timesCalled = 0
    var manyFn = function (e) {
      if (++timesCalled >= max) {
        this.off(event, manyFn)
      }
      listener(e)
    }.bind(this)
    return this.on(event, manyFn)
  },
  off: function (event, listener) {
    var index
    if (event in this._listeners && ~(index = this._listeners[event].indexOf(listener)))
      this._listeners[event].splice(index, 1)
  },
  mixin: function (obj) {
    obj.on = this.on.bind(this)
    obj.once = this.once.bind(this)
    obj.many = this.many.bind(this)
    obj.off = this.off.bind(this)
    obj.emit = this.emit.bind(this)
    obj.mixin = this.mixin.bind(this)
    obj.observe = this.observe.bind(this)

    return obj
  },
  emit: function (eventName, event, onlyLocal) {
    if (eventName in this._listeners) for (var i = 0; i < this._listeners[eventName].length; i++)
      this._listeners[eventName][i](event)

    if (!Boolean(onlyLocal)) {
      if (isBrowserEnviornment && supportsServiceWorker) {
        navigator.serviceWorker.getRegistration().then(function (reg) {
          if (reg && reg.active) reg.active.postMessage({
            __brev: true,
            eventName: eventName,
            event: event
          })
        })
      } else if (typeof clients !== 'undefined') {
        clients.matchAll().then(function (clients) {
          clients.forEach(function (client) {
            client.postMessage({
              __brev: true,
              eventName: eventName,
              event: event
            })
          })
        })
      }
    }
  }
})

return createBus().mixin(createBus)
})()

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  self.addEventListener('message', function (e) {
    if (typeof e.data === 'object' && e.data.__brev)
      brev.emit(e.data.eventName, e.data.event, true)
  })
}

if (typeof module === "object" && typeof module.exports === "object")
  module.exports = brev
