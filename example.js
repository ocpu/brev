var bus = require('brev');

function handler(event) {
    console.log(event);
}

bus.on('connect', handler);

bus.emit('connect', 'connected');

bus.off('connect', handler);

bus.once('connect').then(e => {
    console.log(e);
});

bus.observe('connect')
    .filter(e => typeof e === 'string')
    .map(e => e.toLowerCase())
    .run(e => {
        console.log(e)
    })
