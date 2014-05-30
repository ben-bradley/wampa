var Wampa = require('../wampa'),
    should = require('should'),
    http = require('http');

var server;

beforeEach(function(done) {
  server = http.createServer();
  server.on('listening', done);
  server.listen(3000);
});

afterEach(function(done) {
  server.close();
  done();
});


describe('Wampa', function() {


  it('should be able to call #Server && #Client', function() {
    var wampa = new Wampa.Server({ server: server, path: '/wampa' });
    var socket = new Wampa.Client('http://localhost:3000/wampa');
  });


  describe('#Server', function() {

    it('should emit events on connection', function(done) {
      var wampa = new Wampa.Server({ server: server, path: '/wampa' });
      wampa.on('connection', function(socket) { done(); });
      var socket = new Wampa.Client('http://localhost:3000/wampa');
    });

    it('should be able to trigger #Client\'s exposed fns', function(done) {
      var wampa = new Wampa.Server({ server: server, path: '/wampa' });
      wampa.on('connection', function(socket) {
        socket.on('exposed', function(fns) {
          socket.run.blargh(new Date().getTime());
        });
      });
      var socket = new Wampa.Client('http://localhost:3000/wampa');
      socket.on('open', function() {
        socket.expose({
          blargh: function(ms) {
            (ms).should.be.a.Number;
            done();
          }
        });
      });
    });

    it('should be able to send events via the websocket', function(done) {
      var wampa = new Wampa.Server({ server: server, path: '/wampa' });
      wampa.on('connection', function(socket) {
        socket.sendEvent('blargh', new Date().getTime());
      });
      var socket = new Wampa.Client('http://localhost:3000/wampa');
      socket.on('open', function() {
        socket.on('blargh', function(ms) {
          (ms).should.be.a.Number;
          done();
        })
      });
    });

  });


  describe('#Client', function() {

    it('should emit events on connection', function(done) {
      var wampa = new Wampa.Server({ server: server, path: '/wampa' });
      var socket = new Wampa.Client('http://localhost:3000/wampa');
      socket.on('open', function() { done(); });
    });

    it('should be able to trigger #Server\'s exposed fns', function(done) {
      var wampa = new Wampa.Server({ server: server, path: '/wampa' });
      wampa.on('connection', function(socket) {
        socket.expose({
          blargh: function(ms) {
            (ms).should.be.a.Number;
            done();
          }
        });
      });
      var socket = new Wampa.Client('http://localhost:3000/wampa');
      socket.on('exposed', function() {
        socket.run.blargh(new Date().getTime());
      });
    });

    it('should be able to send events via the websocket', function(done) {
      var wampa = new Wampa.Server({ server: server, path: '/wampa' });
      wampa.on('connection', function(socket) {
        socket.on('blargh', function(ms) {
          (ms).should.be.a.Number;
          done();
        });
      });
      var socket = new Wampa.Client('http://localhost:3000/wampa');
      socket.on('open', function() {
        socket.sendEvent('blargh', new Date().getTime());
      });
    });

    it('should be able to publish && subscribe to a channel', function(done) {
      var wampa = new Wampa.Server({ server: server, path: '/wampa' });
      var socket = new Wampa.Client('http://localhost:3000/wampa');
      socket.on('subscribed', function(channel) {
        (channel).should.equal('blargh');
        socket.publish(channel, { time: new Date().getTime() });
      });
      socket.on('open', function() {
        socket.subscribe([ 'blargh' ]);
        socket.on('blargh', function(data) {
          (data.time).should.be.a.Number;
          done();
        });
      });
    });

  });


});

/*
  // !subscribed occurs when the server has acknowledged the client's subscriptions
  socket.on('subscribed', function(channel) {
    // #publish(<channel>, <message>)
    socket.publish('arbitraryName', { data: 1234 });
  });

  socket.subscribe([ 'arbitraryName' ]);

  socket.on('arbitraryName', function(message) {
    console.log('got delivery of a subscription on "arbitraryName":', message.data);
  });
*/
