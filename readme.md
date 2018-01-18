[![CircleCI][img-circle]][url-circle]
[![NPM version][img-npm]][url-npm]
[![NPM Downloads][img-downloads]][url-downloads]
[![License][img-license]][url-license]

This is a event bus system that primarily sends and recives events. You are able to create
new event busses and mix them into other objects. This script also works in a web page. While
in a web page you have the capabillity to comunicate to the running service worker and the 
from the serviceworker to all active tabs not across browsers.

## API

- [brev.createBus()](#brevcreatebus)
- [bus.on(topic, listener)](#busontopic-listener)
- [bus.once(topic[, listener])](#busoncetopic-listener)
- [bus.many(topic, max, listener)](#busmanytopic-max-listener)
- [bus.observe(topic)](#busobservetopic)
- [bus.off(topic, listener)](#busofftopic-listener)
- [bus.emit(topic\[, event\]\[, onlyLocal\])](#busemittopic-event-onlylocal)
- [bus.mixin(obj)](#busmixinobj)

### exports

```js
const brev = require("brev")
var globalBus = brev // The global brev bus
var bus = brev() // A new brev bus
```

### bus.on(topic, listener)
|Parameter|Type|Description|
|-|-|-|
|`topic`|[String][mdn-str]|The event to listen to.|
|`listener`|[Function][mdn-fun]|The actual listener to get fired.|

Returns: The instance.

Add a listener for the event given on this event bus.

```js
function handler(e) {}
bus.on('connect', handler);
```

### bus.once(topic, listener)
|Parameter|Type|Description|
|-|-|-|
|`topic`|[String][mdn-str]|The event name|
|`listener`|[Function][mdn-fun]|The function handling the event|

Returns: [Promise\<Result>][mdn-prm] Promise with the result of the listener or the event.

Registers a handler to the given topic.
It will only be called one time before it is unregistered.

It returns a promise containing the event if no listener was registered.
Otherwise the promise contains the result of the listener.

```js
function handler(e) {}
bus.once('connect', handler);
```

### bus.many(topic, max, listener)
|Parameter|Type|Description|
|-|-|-|
|`topic`|[String][mdn-str]|The event to listen to.|
|`max`|[Number][mdn-num]|The maximum amount of times the listener can be called.|
|`listener`|[Function][mdn-fun]|The listener to get fired.|

Returns: The instance

Add a listener for the event given on this event bus.
It will only be called x amount of times before it is automatically unregistered.

```js
function handler(e) {}
bus.many('connect', 3, handler);
```

### bus.observe(topic)
|Parameter|Type|Description|
|-|-|-|
|`topic`|[String][mdn-str]|The event to listen to.|

Returns: A object with some methods.

Register a observer on a topic.

You can filter the events with the `filter` method, transform the value with `map` and 
access the value with `run`. 

To unregister the observer call `unobserve`.

```js
bus.observe('connect')
    .filter(e => typeof e === 'string')
    .map(e => e.toLowerCase())
    .run(e => {
        console.log(e)
    })
```

### bus.off(topic, listener)
|Parameter|Type|Description|
|-|-|-|
|`topic`|[String][mdn-str]|The event the listener is registered on.|
|`listener`|[Function][mdn-fun]|The listener to remove.|

Unregister a listener from the given event.

```js
function handler(e) {}
bus.off('connect', handler)
```

### bus.emit(topic\[, event]\[, onlyLocal])
|Parameter|Type|Description|
|-|-|-|
|`topic`|[String][mdn-str]|The event name to execute the event on.|
|`[event]`|Any|The event to get passed to listeners.|
|`[onlyLocal]`|[Boolean][mdn-bol]=`false`|Whether or not the event should be broadcasted to the serviceworker / tabs.|

Emit a event to all listeners registered to the given `topic`.

```js
bus.emit('connect', { status: 'ok' })
```

### bus.mixin(obj)
|Parameter|Type|Description|
|-|-|-|
|`obj`|Any|The object to mix into.|

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

[url-circle]: https://circleci.com/gh/ocpu/brev
[url-npm]: https://npmjs.org/package/brev
[url-license]: lisense.md
[url-downloads]: https://npmjs.org/package/brev
[url-cc]: https://codecov.io/gh/ocpu/Brev

[img-circle]: https://img.shields.io/circleci/project/github/ocpu/brev.svg?style=flat-square
[img-npm]: https://img.shields.io/npm/v/brev.svg?style=flat-square
[img-license]: https://img.shields.io/npm/l/brev.svg?style=flat-square
[img-downloads]: https://img.shields.io/npm/dm/brev.svg?style=flat-square
[img-cc]: https://img.shields.io/codecov/c/github/ocpu/Brev/master.svg?style=flat-square
