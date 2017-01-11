//noinspection JSUnresolvedVariable,SpellCheckingInspection
module.exports = evently = {
    /**
     * The current handlers in the system.
     *
     * @type {Object.<String, Array.<Function>>}
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
        if (typeof handler !== 'function')
            throw new TypeError('handler has to be defined and has to be a function')
        var cbs = this._handlers[eventName] = this._handlers[eventName] || []
        if (cbs.indexOf(handler) === -1)
            cbs.push(handler)
        return this
    },
    /**
     * Unregister a handler from the given eventName.
     *
     * @param {String} eventName
     * @param {Function} handler
     * @returns {evently}
     */
    off: function off(eventName, handler) {
        if (eventName in this._handlers && handler in this._handlers[eventName])
            this._handlers[eventName].splice(this._handlers[eventName].indexOf(handler), 1)
        return this
    },
    /**
     * Trigger a event to all handlers registered.
     * under the given eventName
     *
     * @param {String} name
     * @param {*} event
     * @returns {void}
     */
    trigger: function trigger(name, event) {
        if (this._handlers[name])
            for (var hs = this._handlers[name], i = 0, handler = hs[i]; i < hs.length; i++, handler = hs[i])
                handler(event)
    },
    /**
     * Mixin the current event system with a object.
     *
     * @param {*} obj
     * @returns {*}
     */
    mixin: function mixin(obj) {
        obj['on'] = this.on
        obj['off'] = this.off
        obj['trigger'] = this.trigger
        obj['_handlers'] = this._handlers
        return obj
    },
    /**
     * Creates a new and fresh event system.
     *
     * @returns {evently}
     */
    create: function create() {
        //noinspection JSUnresolvedVariable,JSValidateTypes
        return {
            _handlers: {},
            on: evently.on,
            off: evently.off,
            trigger: evently.trigger,
            mixin: evently.mixin,
            create: evently.create
        }
    }
}
