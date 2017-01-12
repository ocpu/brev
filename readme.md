# Evently
A basic event system

## API

- [on(eventName, handler)](#oneventname-handler)
- [once(eventName, handler)](#onceeventname-handler)
- [many(eventName, timesAvailable, handler)](#manyeventname-timesavailable-handler)
- [off(eventName, handler)](#offeventname-handler)
- [trigger(eventName[, event)]](#triggereventname-event)
- [mixin(obj)](#mixinobj)
- [create()](#create)

### on(eventName, handler)
- `eventName` [\<String>][mdn-str] The event name
- `handler` [\<Function>][mdn-fun] The function handling the event
- Returns: \<evently> Mainly if you want to chaining calls

Registers a handler to the given eventName.

```js
function handler(e) {}
evently.on('connect', handler);
```

### once(eventName, handler)
- `eventName` [\<String>][mdn-str] The event name
- `handler` [\<Function>][mdn-fun] The function handling the event
- Returns: \<evently> Mainly if you want to chaining calls

Registers a handler to the given eventName.
It will only be called one time before it is unregistered.

```js
function handler(e) {}
evently.once('connect', handler);
```

### many(eventName, timesAvailable, handler)
- `eventName` [\<String>][mdn-str] The event name
- `timesAvailable` [\<String>][mdn-str] The event name
- `handler` [\<Number>][mdn-num] The function handling the event
- Returns: \<evently> Mainly if you want to chaining calls

Registers a handler to the given eventName.
It will only be called x amount of times before it is unregistered.

```js
function handler(e) {}
evently.many('connect', 3, handler);
```

### off(eventName, handler)
- `eventName` [\<String>][mdn-str] The event name
- `handler` [\<Function>][mdn-fun] The function handling the event
- Returns: \<evently> Mainly if you want to chaining calls

Unregisters a handler to the given eventName.

```js
function handler(e) {}
evently.off('connect', handler)
```

### trigger(eventName\[, event])
- `eventName` [\<String>][mdn-str] The event name
- `event` \<Any> Any kind of value you want to pass to the handler(s) **Default:** `undefined`

Trigger a event to all handlers registered under the given event name.

```js
evently.trigger('connect', { status: 'ok' })
```

### mixin(obj)
- `obj` [\<Object>][mdn-obj] | \<Any> The object you want the event system to mix into
- Returns: [\<Object>][mdn-obj] | \<Any> The mixed object

Mixin the current event system with th specified object.

(This method will override any and all functions with the same names as the api.)

```js
evently.mixin(myObj)
```

### create()
- Returns: \<evently> A new event system

Creates a new and fresh event system.

```js
var bus = evently.create()
```

[mdn-str]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[mdn-fun]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[mdn-num]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[mdn-obj]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
