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

  socket.on('exposed', function() {
    console.log('server is exposed!');
    socket.run.serveBacon();
  });

  // !subscribed occurs when the server has acknowledged the client's subscriptions
  socket.on('subscribed', function(channel) {
    // #publish(<channel>, <message>)
    socket.publish('arbitraryName', { data: 1234 });
  });

  socket.subscribe([ 'arbitraryName' ]);

  socket.on('arbitraryName', function(message) {
    console.log('got delivery of a subscription on "arbitraryName":', message.data);
  });

});
