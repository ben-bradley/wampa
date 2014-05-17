var Wampa = require('../wampa');

var socket = new Wampa.Client('http://localhost:8000/wampa');

socket.on('open', function() {
  console.log('connected');

  socket.expose({
    ping: function(data, datum) {
      socket.sendEvent('myping', 'blargh!')
    },
    pong: function(data) { console.log('pong!', data); }
  });

  socket.on('expose', function() {
    console.log('server is exposed!');
    socket.run.serveBacon()
  });

});
