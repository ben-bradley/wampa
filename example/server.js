var Wampa = require('../wampa'),
    http = require('http');

var server = http.createServer();

var wampaServer = new Wampa.Server({ server: server, path: '/wampa' });

wampaServer.on('connection', function(socket) {

  socket.on('exposed', function(fns) {
    console.log('client exposed: ', fns);
    socket.run.ping({ pinged: new Date().getTime() });
  });

  socket.on('pong', function(data) {
    var now = new Date().getTime();
    console.log('[========== ping stats ==========]');
    console.log('server pinged at:', data.pinged);
    console.log('client ponged at:', data.ponged);
    console.log('server -> client:', data.ponged-data.pinged);
    console.log('client -> server:', now - data.ponged);
    console.log('round trip      :', now - data.pinged);
    console.log('[========== ping stats ==========]');
  });

  socket.expose({
    serveBacon: function(x) {
      console.log('the client wants '+x+' strips of bacon!');
    }
  });

});

server.listen(8000);
