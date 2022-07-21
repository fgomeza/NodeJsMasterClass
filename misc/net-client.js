/**
 * Example TCP (Net) client
 * Connect to port 6000 and sends the word "ping" to the servers
 */

// Dependencies
const net = require('net');

let outboundMessage = 'ping';

var client = net.createConnection({'port': 6000}, function () {
    client.write(outboundMessage);
});

// When the server writes back log what it says then kill the client
client.on('data', function(inboundMessage) {
    let messageString = inboundMessage.toString();
    console.log('I wrote '+outboundMessage+' and they said '+messageString);
    client.end();
})