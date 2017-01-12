var assign = require('object-assign')
function search(bus, eventName, handler) {
    var handlers = bus._handlers[eventName]
    if (handlers) for (var i = 0; i < handlers.length; i++)
        if (handlers[i].handler === handler)
            return i
    return -1
}
//noinspection JSUnresolvedVariable,SpellCheckingInspection
/**
 *
 * @type {{_handlers: {}, on: module.exports.on, off: module.exports.off, many: module.exports.many, once: module.exports.once, trigger: module.exports.trigger, mixin: module.exports.mixin, create: module.exports.create, info: module.exports.info}}
 */
var evently = module.exports = {
    /**
     * The current handlers in the system.
     *
     * @type {Object.<String, Array.<{max: Number, executed: Number, handler: Function}>>}
     */
    _handlers: {},
    /**
     * Registers a handler to the given eventName.
     *
     * @param {String} eventName
     * @param {Function} handler
     * @returns {evently}
     */
    on: function on(eventName, handler) {
        return this.many(eventName, Infinity, handler)
    },
    /**
     * Unregister a handler from the given eventName.
     *
     * @param {String} eventName
     * @param {Function} handler
     * @returns {evently}
     */
    off: function off(eventName, handler) {
        var handlers = this._handlers[eventName]
        var index
        if ((index = search(this, eventName, handler)) !== -1)
            handlers.splice(index, 1)
        return this
    },
    /**
     * Registers a handler to the given eventName.
     * It will only be called x amount of times before it is unregistered.
     *
     * @param {String} eventName
     * @param {Number} timesAvailable
     * @param {Function} handler
     * @returns {evently}
     */
    many: function many(eventName, timesAvailable, handler) {
        if (typeof timesAvailable === 'undefined' || timesAvailable < 1 && isFinite(timesAvailable))
            throw new TypeError('amount has to be defined and be higher than 0')
        if (typeof handler !== 'function')
            throw new TypeError('handler has to be defined and has to be a function')
        var handlers = this._handlers[eventName] = this._handlers[eventName] || []
        if (search(this, eventName, handler) === -1)
            handlers.push({ max: timesAvailable, executed: 0, handler: handler })
        return this
    },
    /**
     * Registers a handler to the given eventName.
     * It will only be called one time before it is unregistered.
     *
     * @param {String} eventName
     * @param {Function} handler
     * @returns {evently}
     */
    once: function once(eventName, handler) {
        return this.many(eventName, 1, handler)
    },
    /**
     * Trigger a event to all handlers registered
     * under the given eventName.
     *
     * @param {String} eventName
     * @param {*} [event]
     * @returns {void}
     */
    trigger: function trigger(eventName, event) {
        var handlers = this._handlers[eventName]
        if (handlers) for (var i = 0; i < handlers.length; i++) {
            var handler = handlers[i]
            if (isFinite(handler.max))
                if (++handler.executed >= handler.max)
                    this.off(eventName, handler.handler)
            handler.handler(event)
        }
    },
    /**
     * Mixin the current event system with th specified object.
     *
     * @param {(Object|*)} obj
     * @returns {*}
     */
    mixin: function mixin(obj) {
        return assign(obj, evently)
    },
    /**
     * Creates a new and fresh event system.
     *
     * @returns {evently}
     */
    create: function create() {
        //noinspection JSValidateTypes
        return assign(evently, { _handlers: {} })
    },
    /**
     * Get some information about a specific event
     *
     * @param {String} eventName
     * @returns {{name: String, exists: Boolean, length: Number, handlers: Array.<{max: Number, executed: Number, handler: Function}>}}
     */
    info: function info(eventName) {
        var handlers = this._handlers[eventName]
        var exist = typeof handlers !== 'undefined'
        return {
            name: eventName,
            exists: exist,
            length: exist ? handlers.length : 0,
            handlers: exist ? handlers : []
        }
    }
}
