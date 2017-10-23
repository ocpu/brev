function search(forListener) {
    return function (inItem) {
        return inItem && typeof inItem.listener === "function" && inItem.listener === forListener
    }
}

function off(listeners, eventName, listener) {
    if (!(eventName in listeners))
        return
    var index
    if (~(index = listeners[eventName].findIndex(search(listener)))) 
        listeners[eventName].splice(index, 1)
}

function many(listeners, eventName, max, listener) {
    if (isFinite(max) && max < 0)
        return this
    if (!eventName && typeof eventName !== "string")
        return this
    if (!listener && typeof listener !== "function")
        return this

    if (!(eventName in listeners) || !~listeners[eventName].findIndex(search(listener)))
        listeners[eventName] = (listeners[eventName] || []).concat({
            executed: 0,
            max: max,
            listener: listener
        })
    return this
}

var idCounter = 0
function once(listeners, eventName, listener) {
    return new Promise(function (resolve, reject) {
        once_fn.id = idCounter++
        many(listeners, eventName, 1, once_fn)
        function once_fn(event) {
            try {
                resolve(listener ? listener(event) : event)
            } catch (e) {
                reject(e)
            }
        }
    })
}

function on(listeners, eventName, listener) {
    return many.call(this, listeners, eventName, Infinity, listener)
}

function emit(listeners, eventName, event) {
    if (eventName in listeners) {
        var item, i = listeners[eventName].length
        
        while (i--) {
            item = listeners[eventName][i]
            item.listener.call(null, event)
            if (!isFinite(item.max))
                return
            item.executed++
            if (item.executed >= item.max)
                listeners[eventName].splice(i, 1)
        }
    }
}

function reflect(listeners, eventName) {
    return listeners[eventName] || []
}

exports.createBus = function createBus() {
    // { [eventName]: [{ executed, max, listener }, ...] }
    var listeners = {}
    var bus = {
        off: off.bind(null, listeners),
        /**
         * Registers a handler to the given eventName.
         * It will only be called x amount of times before it is unregistered.
         *
         * @param {String} eventName
         * @param {Number} timesAvailable
         * @param {Function} handler
         * @returns {brev}
         */
        many: many.bind(bus, listeners),
        once: once.bind(null, listeners),
        on: on.bind(bus, listeners),
        emit: emit.bind(null, listeners),
        reflect: reflect.bind(null, listeners)
    }
    return bus
}
