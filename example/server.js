var Wampa = require('../wampa'),
    http = require('http');

var server = http.createServer();

var wampaServer = new Wampa.Server({ server: server, path: '/wampa' });

wampaServer.on('connection', function(socket) {
  console.log('connected!');
  socket.on('message', function(msg) {
    console.log(msg);
  })
});


server.listen(8000);
