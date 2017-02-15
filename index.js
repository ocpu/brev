'use strict';
(function (factory) {
    /* istanbul ignore next */
    //noinspection JSUnresolvedVariable
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') //noinspection JSUnresolvedVariable
        module.exports = factory()
    else//noinspection JSUnresolvedVariable
        if (typeof define !== 'undefined' && define.amd) //noinspection JSUnresolvedFunction
            define(factory)
})(function () {

/**
 * Find a handler in an event
 *
 * @param {Brev} bus
 * @param {String} eventName
 * @param {Function} handler
 * @returns {Number}
 */
function search(bus, eventName, handler) {
    var handlers = bus.__handlers__[eventName]
    if (handlers) for (var i = 0; i < handlers.length; i++)
        if (handlers[i].func === handler)
            return i
    return -1
}

function Handler(max, handler) {
    this.max = max
    this.executed = 0
    //noinspection JSUnresolvedVariable
    this.func = handler
}

var properties = ['__handlers__', 'many', 'once', 'on', 'off', 'emit', 'mixin']

function Brev() {
    /**
     * The current handlers in the system.
     *
     * @type {Object.<String, Array.<Handler>>}
     */
    this.__handlers__ = {}
}

/**
 * Registers a handler to the given eventName.
 * It will only be called x amount of times before it is unregistered.
 *
 * @param {String} eventName
 * @param {Number} timesAvailable
 * @param {Function} handler
 * @returns {Brev}
 */
Brev.prototype.many = function (eventName, timesAvailable, handler) {
    if (typeof timesAvailable === 'undefined' || timesAvailable < 1 && isFinite(timesAvailable))
        throw new TypeError('amount has to be defined and be higher than 0')
    if (typeof handler !== 'function')
        throw new TypeError('handler has to be defined and has to be a function')
    var handlers = this.__handlers__[eventName] = this.__handlers__[eventName] || []
    if (search(this, eventName, handler) === -1)
        handlers.push(new Handler(timesAvailable, handler))
    return this
}
/**
 * Registers a handler to the given eventName.
 * It will only be called one time before it is unregistered.
 *
 * @param {String} eventName
 * @param {Function} handler
 * @returns {Brev}
 */
Brev.prototype.once = function (eventName, handler) {
    return this.many(eventName, 1, handler)
}
/**
 * Registers a handler to the given eventName.
 *
 * @param {String} eventName
 * @param {Function} handler
 * @returns {Brev}
 */
Brev.prototype.on = function (eventName, handler) {
    return this.many(eventName, Infinity, handler)
}
/**
 * Unregister a handler from the given eventName.
 *
 * @param {String} eventName
 * @param {Function} handler
 * @returns {Brev}
 */
Brev.prototype.off = function (eventName, handler) {
    var handlers = this.__handlers__[eventName]
    var index
    if ((index = search(this, eventName, handler)) !== -1)
        handlers.splice(index, 1)
    return this
}
/**
 * Trigger a event to all handlers registered
 * under the given eventName.
 *
 * @param {String} eventName
 * @param {*} [event]
 * @returns {void}
 */
Brev.prototype.emit = function (eventName, event) {
    var handlers = this.__handlers__[eventName]
    if (handlers) for (var i = 0; i < handlers.length; i++) {
        var handler = handlers[i]
        if (isFinite(handler.max)) if (++handler.executed >= handler.max)
            this.off(eventName, handler.func)
        handler.func(event)
    }
}
/**
 * Mixin the current event system with th specified object.
 *
 * @param {(Object|*)} obj
 * @returns {*}
 */
Brev.prototype.mixin = function (obj) {
    for (var i = 0; i < properties.length; i++)
        obj[properties[i]] = this[properties[i]]
}

/**
 * The global Brev bus
 *
 * @type {Brev}
 */
var globalBrev = new Brev
/**
 * Creates a new and fresh event system.
 *
 * @returns {Brev}
 */
globalBrev.createBus = function () {
    return new Brev
}
/**
 * Get some information about a specific event
 *
 * @param {Brev} bus
 * @param {String} eventName
 * @returns {{name: String, exists: Boolean, length: Number, handlers: Array.<Handler>}}
 */
globalBrev.reflect = function (bus, eventName) {
    var handlers = bus.__handlers__[eventName]
    var exist = typeof handlers !== 'undefined'
    return {
        name: eventName,
        exists: exist,
        length: exist ? handlers.length : 0,
        handlers: exist ? handlers : []
    }
}

return globalBrev
})