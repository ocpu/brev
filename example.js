var bus = require('evently');

function handler(event) {
    console.log(event);
}

bus.on('connect', handler);

bus.trigger('connect', 'connected');

bus.off('connect', handler);