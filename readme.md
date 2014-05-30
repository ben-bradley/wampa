# Wampa [![Build Status](https://secure.travis-ci.org/ben-bradley/wampa.png)](http://travis-ci.org/ben-bradley/wampa) [![NPM](https://nodei.co/npm/wampa.png?downloads=true)](https://nodei.co/npm/wampa/)

Bi-directional, evented, websocketed, JSON RPC.

It's kinda like WAMP, but not really.

And the name `Wampa` wasn't taken, so I jumped on it!

_(insert pic of me riding a wampa)_

The whole thing sits on top of the `ws` module and provides some sugar and a tiny bit of convenience for the RPC-ish stufff.

## Install

`npm install wampa`

## Test

`npm test`
-or-
`mocha`

## Usage

###server.js
```javascript
var Wampa = require('wampa'),
    http = require('http');

var server = http.createServer();

var wampaServer = new Wampa.Server({ server: server, path: '/wampa' });

wampaServer.on('connection', function(socket) {

  // the #Client has exposed some fns to the #Server
  socket.on('expose', function(fns) {
    // run the ping() fn on the #Client
    socket.run.ping('blargh!', 'honk!');
  });

  // handle arbitrary events from the #Client
  socket.on('clientEvent', function(data) {
    console.log('got clientEvent: ', data);
  });

  // expose a fn to the #Client
  socket.expose({
    serveBacon: function() {
      console.log('the client wants bacon!');
    }
  });

});

server.listen(8000);
```
###client.js
```javascript
var Wampa = require('../wampa');

var socket = new Wampa.Client('http://localhost:8000/wampa');

socket.on('open', function() {
  console.log('connected');

  // expose #Client fns to the #Server
  socket.expose({
    ping: function(data, datum) {
      // send an event back to the #Server
      socket.sendEvent('clientEvent', 'blargh!')
    },
    pong: function(data) { console.log('pong!', data); }
  });

  // run exposed #Server fns from the #client
  socket.on('expose', function() {
    console.log('server is exposed!');
    socket.run.serveBacon()
  });

});
```

## Events

See https://github.com/einaros/ws/blob/master/doc/ws.md for the details of `ws` events.

- `Wampa.Server === ws.Server()`
- `Wampa.Client === ws()`
- `socket.on('expose', function([FnNames]) { });`

## Methods

- `Socket.expose({})` - Accepts an object of functions to expose to the connected socket.
- `Socket.run.<exposed fn>` - Triggers exposed functions on the connected socket.
- `Socket.sendEvent('blargh'[, args ])` - Sends `blargh` event with optional `args` to connected socket.

## Examples

Look in the `examples/` folder to see the good stuff.

## Versions

### 0.0.5
- Fixed the failing tests

### 0.0.4
- Started keeping track
- Added rudimentary pub/sub
