var isBrowserEnviornment = typeof window !== 'undefined' && typeof document !== 'undefined',
supportsServiceWorker = typeof navigator !== 'undefined' && 'serviceWorker' in navigator

class Observeable {
    constructor() {
        this.listeners = []
    }

    getListener(listener) {
        return this.listeners.findIndex(search(listener))
    }

    emit(event) {
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

    register(max, listener) {
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

    unregister(listener) {
        var index
        if (~(index = this.getListener(listener)))
            this.listeners.splice(index, 1)
    }
}

class Brev {
    constructor() {
        this.__idCounter = 0
        this.__observables = {}
        this.handler = this.handler.bind(this)
        if (typeof registration === "object")
            addEventListener("message", this.handler)
        else if (isBrowserEnviornment && supportsServiceWorker)
            navigator.serviceWorker.addEventListener("message", this.handler)
    }

    async emit(eventName, event, local=false) {
        if (eventName in this.__observables)
            this.__observables[eventName].emit(event)
        if (!Boolean(local) && isBrowserEnviornment && supportsServiceWorker) {
            const reg = await navigator.serviceWorker.getRegistration()
            if (reg && reg.active) reg.active.postMessage({
                eventName: eventName, 
                event: event
            })
        } else if (!Boolean(local) && typeof clients !== 'undefined') {
            const clients = await self.clients.matchAll()
            clients.forEach(client => client.postMessage({
                eventName: eventName, 
                event: event
            }))
        }
    }

    handler(event) {
        if (event.data.eventName in this.__observables)
            this.__observables[event.data.eventName].emit(event.data.event)
    }

    many(event, max, listener) {
        if (typeof event !== "string" || (typeof event === "string" && event === ""))
            throw new Error("event must me something")
        if (!(event in this.__observables))
            this.__observables[event] = new Observeable
        this.__observables[event].register(max, listener)
        return this
    }

    once(event, listener) {
        if (typeof event !== "string" || (typeof event === "string" && event === ""))
            throw new Error("event must me something")
        if (!(event in this.__observables))
            this.__observables[event] = new Observeable
        
        return new Promise((resolve, reject) => {
            once_fn.id = this.__idCounter++
            this.__observables[event].register(1, once_fn)
            function once_fn(event) {
                try {
                    resolve(listener ? listener(event) : event)
                } catch (e) {
                    reject(e)
                }
            }
        })
    }

    on(event, listener) {
        if (typeof event !== "string" || (typeof event === "string" && event === ""))
            throw new Error("event must me something")
        if (!(event in this.__observables))
            this.__observables[event] = new Observeable
        this.__observables[event].register(Infinity, listener)
        return this
    }

    off(event, listener) {
        if (event in this.__observables)
            this.__observables[event].unregister(listener)
    }

    mixin(object) {
        return Object.assign({}, object, {
            on: Brev.prototype.on.bind(this),
            once: Brev.prototype.once.bind(this),
            many: Brev.prototype.many.bind(this),
            off: Brev.prototype.off.bind(this),
            emit: Brev.prototype.emit.bind(this),
            mixin: Brev.prototype.mixin.bind(this)
        })
    }

    reflect(event) {
        return event in this.__observables ? this.__observables[event] : new Observeable
    }
}

const search = forListener => item =>
    item && typeof item.listener === "function" && item.listener === forListener

export const createBus = () => new Brev
export const bus = new Brev