var bus = require('brev');

function handler(event) {
    console.log(event);
}

bus.on('connect', handler);

bus.emit('connect', 'connected');

bus.off('connect', handler);

bus.once("finnish").then(e => {
    console.log(e);
});
