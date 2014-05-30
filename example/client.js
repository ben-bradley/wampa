var Wampa = require('../wampa');

var socket = new Wampa.Client('http://localhost:8000/wampa');

socket.on('open', function() {
  console.log('connected');

  socket.expose({
    ping: function(data) {
      data.ponged = new Date().getTime();
      socket.sendEvent('pong', data);
      console.log('[========== ping stats ==========]');
      console.log('server pinged at:', data.pinged);
      console.log('client ponged at:', data.ponged);
      console.log('server -> client:', data.ponged-data.pinged);
      console.log('[========== ping stats ==========]');
    }
  });

  socket.on('exposed', function(fns) {
    console.log('server exposed: ', fns);
    socket.run.serveBacon(4);
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
