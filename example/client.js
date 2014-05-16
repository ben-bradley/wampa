var Wampa = require('../wampa');

var wampaClient = new Wampa.Client('http://localhost:8000/wampa');

wampaClient.on('open', function() {
  console.log('connected');
  wampaClient.sendJSON({ blargh: 'honk' });
});

wampaClient.blargh({ honk: 'toot' });
