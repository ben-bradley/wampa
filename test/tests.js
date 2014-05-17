var Wampa = require('../wampa'),
    should = require('should'),
    http = require('http');

var server;

beforeEach(function(done) {
  server = http.createServer();
  server.listen(3000);
  done();
});

afterEach(function(done) {
  server.close();
  done();
});


describe('Wampa', function() {


  it('should talk via web socket', function(done) {
    var wampa = new Wampa.Server({ server: server, path: '/wampa' });
    var socket = new Wampa.Client('http://localhost:3000/wampa');
    done();
  });


  describe('#Server', function() {

    it('should emit events on connection', function(done) {
      var wampa = new Wampa.Server({ server: server, path: '/wampa' });
      wampa.on('connection', function(socket) { done(); })
      var socket = new Wampa.Client('http://localhost:3000/wampa');
    });

    it('should be able to trigger #Client\'s exposed fns', function(done) {
      var wampa = new Wampa.Server({ server: server, path: '/wampa' });
      wampa.on('connection', function(socket) {
        socket.on('expose', function(fns) {
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
      socket.on('expose', function() {
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

  });


});
