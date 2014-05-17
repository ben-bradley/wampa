var ws = require('ws'),
    events = require('events'),
    util = require('util');

var Wampa = {

  Client: function(host) {
    var client = new ws(host);
    // register the event handler
    client.on('message', handleEventMessage)
    return client;
  },

  Server: function(options) {
    var server = new ws.Server(options);
    // when a connection occurs, register the event handler
    server.on('connection', function(socket) {
      socket.on('message', handleEventMessage);
    });
    return server;
  },

  eventMessageHandler: {
    // built-in handler to register functions
    expose: function(fns) {
      var socket = this;
      socket._remoteFns = fns;
      socket.run = {};
      fns.forEach(function(fn) {
        socket.run[fn] = function() {
          socket.sendEvent('run', { fn: fn, arguments: arguments });
        }
      });
      this.emit('expose', (this._remoteFns));
    },
    // built-in handler to run remote functions
    run: function(data) {
      var args = Object.keys(data.arguments).map(function(k) {
        return data.arguments[k];
      });
      this._exposedFns[data.fn].apply(this, args);
    }
  }
};

// sugar to send JSON via websocket
ws.prototype.sendJSON = function(data, options, callback) {
  this.send(JSON.stringify(data), options, callback);
}

// sugar to send events, think .emit via websocket
ws.prototype.sendEvent = function(event, data, options, callback) {
  var event = { event: event, data: data };
  this.sendJSON(event, options, callback);
}

// fn to expose functions, this is prototyped onto the socket
// so the server can expose functions to the client or vice-versa
ws.prototype.expose = function(fns) {
  var socket = this,
      fnNames = Object.keys(fns);
  this._exposedFns = fns;
  this.sendEvent('expose', fnNames);
}

function handleEventMessage(data) {
  var socket = this;
  try {
    var ev = JSON.parse(data);
    if (Wampa.eventMessageHandler[ev.event])
      Wampa.eventMessageHandler[ev.event].apply(socket, [ ev.data ]);
    else
      socket.emit(ev.event, ev.data);
  }
  catch(err) {
    // wasn't a json message, just let it go, man, just let it go
  }
}

module.exports = Wampa;
