var ws = require('ws'),
    events = require('events'),
    util = require('util');

var Wampa = {
  Client: function(host) {
    var client = this;
    client._ws = new ws(host);

    // tap in to the websocket events
    client._ws.on('open', function() { client.emit('open'); });
    client._ws.on('error', function() { client.emit('error'); });
    client._ws.on('close', function(code, message) { client.emit('close', code, message); });
    client._ws.on('message', function(data, flags) { client.emit('message', data, flags); });
    client._ws.on('ping', function(data, flags) { client.emit('ping', data, flags); });
    client._ws.on('pong', function(data, flags) { client.emit('pong', data, flags); });

    return client;
  },
  Server: function(options) {
    var server = this;
    server._wss = new ws.Server(options);

    // tap into the server events
    server._wss.on('error', function() { server.emit('error'); });
    server._wss.on('headers', function(headers) { server.emit('headers', headers); });
    server._wss.on('connection', function(socket) { server.emit('connection', socket); });

    return server;
  }
}
util.inherits(Wampa.Client, events.EventEmitter);
util.inherits(Wampa.Server, events.EventEmitter);

Wampa.Client.prototype.blargh = function(options) {
  console.log(options);
}

Wampa.Client.prototype.sendJSON = function(data, options, callback) {
  this._ws.send(JSON.stringify(data), options, callback);
}

module.exports = Wampa;
