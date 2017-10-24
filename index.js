'use strict'
var brev = (function(){

    var isBrowserEnviornment = typeof window !== 'undefined' && typeof document !== 'undefined',
        supportsServiceWorker = typeof navigator !== 'undefined' && 'serviceWorker' in navigator

    function Observeable() {
        this.listeners = []
    }

    Observeable.prototype.getListener = function (listener) {
        return this.listeners.findIndex(search(listener))
    }

    Observeable.prototype.emit = function (event) {
        var item, i = this.listeners.length
        
        while (i--) {
            // Get listener
            item = this.listeners[i]
            // Call listener
            item.listener.call(null, event)
            // If it has not a finite max time to call return
            if (!isFinite(item.max))
                return
            // If it has a finite max times to call increment time executed
            item.executed++
            // If the times executed has reached its limit remove listener
            if (item.executed >= item.max)
                this.listeners.splice(i, 1)
        }
    }

    Observeable.prototype.register = function (max, listener) {
        if (isNaN(max) || isFinite(max) && max <= 0)
            return
        if (typeof listener !== "function")
            return
        if (!~this.getListener(listener)) this.listeners.push({
            executed: 0,
            max: max,
            listener: listener
        })
    }

    Observeable.prototype.unregister = function (listener) {
        var index
        if (~(index = this.getListener(listener)))
            this.listeners.splice(index, 1)
    }

    function Brev() {
        this.__observables = {}
        this.handler = this.handler.bind(this)
        if (typeof addEventListener === "function")
            addEventListener("message", this.handler)
    }

    Brev.prototype.__idCounter = 0

    Brev.prototype.emit = function (eventName, event, local) {
        var _local = typeof local === 'boolean' ? local : false
        if (eventName in this.__observables) {
            this.__observables[eventName].emit(event)
        }
        if (!_local && isBrowserEnviornment) {
            if (!supportsServiceWorker)
                return
            navigator.serviceWorker.getRegistration().then(function(reg) {
                if (reg && reg.active) reg.active.postMessage({
                    eventName: eventName, 
                    event: event
                })
            })
        } else if (!_local && typeof clients !== 'undefined') {
            clients.matchAll().then(function (clientList) {
                var i = clients.length
                while (i--) clientList[i].postMessage({
                    eventName: eventName, 
                    event: event
                })
            })
        }
    }

    Brev.prototype.handler = function (event) {
        if (event.data.eventName in this.__observables)
            this.__observables[event.data.eventName].emit(event.data.event)
    }

    Brev.prototype.many = function (event, max, listener) {
        if (typeof event !== "string" || (typeof event === "string" && event === ""))
            throw new Error("event must me something")
        if (!(event in this.__observables))
            this.__observables[event] = new Observeable
        this.__observables[event].register(max, listener)
        return this
    }

    Brev.prototype.once = function (event, listener) {
        if (typeof event !== "string" || (typeof event === "string" && event === ""))
            throw new Error("event must me something")
        if (!(event in this.__observables))
            this.__observables[event] = new Observeable
        var self = this
        return new Promise(function (resolve, reject) {
            once_fn.id = self.__idCounter++
            self.__observables[event].register(1, once_fn)
            function once_fn(event) {
                try {
                    resolve(listener ? listener(event) : event)
                } catch (e) {
                    reject(e)
                }
            }
        })
    }

    Brev.prototype.on = function (event, listener) {
        if (typeof event !== "string" || (typeof event === "string" && event === ""))
            throw new Error("event must me something")
        if (!(event in this.__observables))
            this.__observables[event] = new Observeable
        this.__observables[event].register(Infinity, listener)
        return this
    }

    Brev.prototype.off = function (event, listener) {
        if (event in this.__observables)
            this.__observables[event].unregister(listener)
    }

    Brev.prototype.mixin = function (object) {
        var obj = {}
        for (var key in object) if (object.hasOwnProperty(key)) 
            Object.defineProperty(obj, key, Object.getOwnPropertyDescriptor(object, key))
        
        obj.on = Brev.prototype.on.bind(this)
        obj.once = Brev.prototype.once.bind(this)
        obj.many = Brev.prototype.many.bind(this)
        obj.off = Brev.prototype.off.bind(this)
        obj.emit = Brev.prototype.emit.bind(this)
        obj.mixin = Brev.prototype.mixin.bind(this)

        return obj
    }

    Brev.prototype.reflect = function (event) {
        return event in this.__observables ? this.__observables[event] : new Observeable()
    }
    
    function search(forListener) {
        return function within(item) {
            return item && typeof item.listener === "function" && item.listener === forListener
        }
    }
    
    function createBus() {
        // { [eventName]: [{ executed, max, listener }, ...] }
        return new Brev
    }
    
    return {
        createBus: createBus,
        bus: createBus()
    }
})()

if (typeof module === "object" && typeof module.exports === "object")
    module.exports = brev
