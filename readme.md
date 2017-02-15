# Brev
A basic event system

[![Build Status][img-travis]][url-travis]
[![NPM version][img-npm]][url-npm]
[![NPM Downloads][img-downloads]][url-downloads]
[![License][img-license]][url-license]
[![codecov][img-cc]][url-cc]

##

## API

- [Class: Brev](#class-brev)
    - [bus.on(eventName, handler)](#busoneventname-handler)
    - [bus.once(eventName, handler)](#busonceeventname-handler)
    - [bus.many(eventName, timesAvailable, handler)](#busmanyeventname-timesavailable-handler)
    - [bus.off(eventName, handler)](#busoffeventname-handler)
    - [bus.emit(eventName[, event])](#busemiteventname-event)
    - [bus.mixin(obj)](#busmixinobj)
- [Class: Handler](#class-hanlder)
    - [handler.max](#handlermax)
    - [handler.executed](#handlerexecuted)
    - [handler.hunc](#handlerhunc)
- [brev.createBus()](#brevcreatebus)
- [brev.reflect(eventName)](#brevreflecteventname)

### Class: Brev
Used to create event buses

#### bus.on(eventName, handler)
- `eventName` [\<String>][mdn-str] The event name
- `handler` [\<Function>][mdn-fun] The function handling the event
- Returns: [\<Brev>](#class-brev) The instance

Registers a handler to the given eventName.

```js
function handler(e) {}
bus.on('connect', handler);
```

#### bus.once(eventName, handler)
- `eventName` [\<String>][mdn-str] The event name
- `handler` [\<Function>][mdn-fun] The function handling the event
- Returns: [\<Brev>](#class-brev) The instance

Registers a handler to the given eventName.
It will only be called one time before it is unregistered.

```js
function handler(e) {}
bus.once('connect', handler);
```

#### bus.many(eventName, timesAvailable, handler)
- `eventName` [\<String>][mdn-str] The event name
- `timesAvailable` [\<Number>][mdn-num] The event name
- `handler` [\<Function>][mdn-fun] The function handling the event
- Returns: [\<Brev>](#class-brev) The instance

Registers a handler to the given eventName.
It will only be called x amount of times before it is unregistered.

```js
function handler(e) {}
bus.many('connect', 3, handler);
```

#### bus.off(eventName, handler)
- `eventName` [\<String>][mdn-str] The event name
- `handler` [\<Function>][mdn-fun] The function handling the event
- Returns: [\<Brev>](#class-brev) The instance

Unregisters a handler to the given eventName.

```js
function handler(e) {}
bus.off('connect', handler)
```

#### bus.emit(eventName\[, event])
- `eventName` [\<String>][mdn-str] The event name
- `event` \<Any> Any kind of value you want to pass to the handler(s) **Default:** `undefined`

Trigger a event to all handlers registered under the given event name.

```js
bus.emit('connect', { status: 'ok' })
```

#### bus.mixin(obj)
- `obj` [\<Object>][mdn-obj] | \<Any> The object you want the event system to mix into
- Returns: [\<Object>][mdn-obj] | \<Any> The mixed object

Mixin the current event system with th specified object.

(This method will override any and all functions with the same names as the api.)

```js
bus.mixin(myObj)
```

### brev.createBus()
- Returns: [\<Brev>](#class-brev) A new event system

Creates a new and fresh event system.

```js
var bus = brev.createBus()
```

### brev.reflect(eventName)
- Returns: [\<Object>][mdn-obj] A new event system
    - name: [\<String>][mdn-str]
    - exists: [\<Boolean>][mdn-bol]
    - length: [\<Number>][mdn-num]
    - handlers: [\<Array.][mdn-arr][\<Handler>](#handler)>

Creates a new and fresh event system.

```js
var reflection = brev.reflect(myEvent)
```

[mdn-str]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[mdn-fun]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[mdn-num]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[mdn-obj]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[mdn-bol]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[mdn-arr]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

[url-travis]: https://travis-ci.org/ocpu/Brev
[url-npm]: https://npmjs.org/package/brev
[url-license]: lisense.md
[url-downloads]: https://npmjs.org/package/brev
[url-cc]: https://codecov.io/gh/ocpu/Brev

[img-travis]: https://img.shields.io/travis/ocpu/Brev.svg?style=flat-square
[img-npm]: https://img.shields.io/npm/v/brev.svg?style=flat-square
[img-license]: https://img.shields.io/npm/l/brev.svg?style=flat-square
[img-downloads]: https://img.shields.io/npm/dm/brev.svg?style=flat-square
[img-cc]: https://img.shields.io/codecov/c/github/ocpu/Brev/master.svg?style=flat-square
