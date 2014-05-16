var Wampa = require('../wampa'),
    assert = require('assert'),
    http = require('http');

describe('Wampa', function() {

//  it('should emit events', function(done) {
//    Wampa.on('blargh', function(data) {
//      assert.equal(data, 'honk');
//      done();
//    });
//    Wampa.emit('blargh', 'honk');
//  });

  it('should connect', function(done) {
    var server = http.createServer();

    var wampaServer = new Wampa.Server({ server: server, path: '/wampa' });

    wampaServer.on('connection', function(socket) {
      wampaServer.close();
      done();
    });

    server.listen(3000);

    var wampaClient = new Wampa.Client('http://localhost:3000/wampa');
  });

  it('should be able to send JSON', function(done) {
    var server = http.createServer();

    var wampaServer = new Wampa.Server({ server: server, path: '/wampa' });

    wampaServer.on('connection', function(socket) {
      socket.on('message', function(msg) {
        var json = JSON.parse(msg);
        assert.equal(json.blargh, 'honk');
        done();
      });
    });

    server.listen(3001);

    var wampaClient = new Wampa.Client('http://localhost:3001/wampa');
    wampaClient.on('open', function() {
      this.sendJSON({ blargh: 'honk' });
    });
  });

});
