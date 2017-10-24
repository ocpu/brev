[![Build Status][img-travis]][url-travis]
[![NPM version][img-npm]][url-npm]
[![NPM Downloads][img-downloads]][url-downloads]
[![License][img-license]][url-license]
[![codecov][img-cc]][url-cc]

##

## API

- [brev.createBus()](#brevcreatebus)
- [bus.on(eventName, handler)](#busoneventname-listener)
- [bus.once(eventName[, handler])](#busonceeventname-listener)
- [bus.many(eventName, timesAvailable, handler)](#busmanyeventname-max-listener)
- [bus.off(eventName, handler)](#busoffeventname-listener)
- [bus.emit(eventName[, event])](#busemiteventname-event)
- [bus.mixin(obj)](#busmixinobj)

### brev.createBus()
- Returns: [\<Brev>](#class-brev) A new event bus

Creates a new and fresh event bus.

```js
var bus = brev.createBus()
```

### bus.on(eventName, listener)
|Parameter|Type|Description|
|-|-|-|
|`eventName`|[\<String>][mdn-str]|The event to listen to.|
|`listener`|[\<Function>][mdn-fun]|The actual listener to get fired.|

Returns: The instance.

Add a listener for the event given on this event bus.

```js
function handler(e) {}
bus.on('connect', handler);
```

### bus.once(eventName, listener)
|Parameter|Type|Description|
|-|-|-|
|`eventName`|[\<String>][mdn-str]|The event name|
|`listener`|[\<Function>][mdn-fun]|The function handling the event|

Returns: [\<Promise\<Result>>][mdn-prm] Promise with the result of the listener or the event.

Registers a handler to the given eventName.
It will only be called one time before it is unregistered.

It returns a promise containing the event if no listener was registered.
Otherwise the promise contains the result of the listener.

```js
function handler(e) {}
bus.once('connect', handler);
```

### bus.many(eventName, max, listener)
|Parameter|Type|Description|
|-|-|-|
|`eventName`|[\<String>][mdn-str]|The event to listen to.|
|`max`|[\<Number>][mdn-num]|The maximum amount of times the listener can be called.|
|`listener`|[\<Function>][mdn-fun]|The listener to get fired.|

Returns: The instance

Add a listener for the event given on this event bus.
It will only be called x amount of times before it is automatically unregistered.

```js
function handler(e) {}
bus.many('connect', 3, handler);
```

### bus.off(eventName, listener)
|Parameter|Type|Description|
|-|-|-|
|`eventName`|[\<String>][mdn-str]|The event the listener is registered on.|
|`listener`|[\<Function>][mdn-fun]|The listener to remove.|

Unregister a listener from the given event.

```js
function handler(e) {}
bus.off('connect', handler)
```

### bus.emit(eventName\[, event])
|Parameter|Type|Description|
|-|-|-|
|`eventName`|[\<String>][mdn-str]|The event name to execute the event on.|
|`[event]`|\<Any>|The event to get passed to listeners.|

Emit a event to all listeners registered to the given `eventName`.

```js
bus.emit('connect', { status: 'ok' })
```

### bus.mixin(obj)
|Parameter|Type|Description|
|-|-|-|
|`obj`|\<Any>|The object to mix into.|

Mixin this eventbus into another object.

```js
var mixedinObjext = bus.mixin({ hello: 'world' })
```

[mdn-str]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[mdn-fun]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[mdn-num]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[mdn-obj]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[mdn-bol]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[mdn-arr]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[mdn-prm]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

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
