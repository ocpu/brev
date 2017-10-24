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
    if (isFinite(max) && max <= 0)
        return this
    if (!eventName && typeof eventName !== "string")
        return this
    if (typeof listener !== "function")
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

function mixin(listeners, object) {
    var obj = {}
    for (var key in object) if (object.hasOwnProperty(key)) 
        Object.defineProperty(obj, key, Object.getOwnPropertyDescriptor(object, key))
    obj["off"] = off.bind(null, listeners)
    obj["many"] = many.bind(obj, listeners)
    obj["once"] = once.bind(null, listeners)
    obj["on"] = on.bind(obj, listeners)
    obj["emit"] = emit.bind(null, listeners)
    obj["reflect"] = reflect.bind(null, listeners)
    obj["mixin"] = mixin.bind(null, listeners)
    return obj
}

function reflect(listeners, eventName) {
    return listeners[eventName] || []
}

exports.createBus = function createBus() {
    // { [eventName]: [{ executed, max, listener }, ...] }
    return mixin({}, {})
}
