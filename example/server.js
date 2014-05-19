var Wampa = require('../wampa'),
    http = require('http');

var server = http.createServer();

var wampaServer = new Wampa.Server({ server: server, path: '/wampa' });

wampaServer.on('connection', function(socket) {

  socket.on('exposed', function(fns) {
    socket.run.ping('blargh!', 'honk!');
  });

  socket.on('myping', function(data) {
    console.log('got myping: ', data);
  });

  socket.expose({
    serveBacon: function() {
      console.log('the client wants bacon!');
    }
  });

});

server.listen(8000);
