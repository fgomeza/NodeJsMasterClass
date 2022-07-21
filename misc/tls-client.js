/**
 * Example TLS client
 * Connect to port 6000 and sends the word "ping" to the servers
 */

// Dependencies
const tls = require('tls');
const fs = require('fs');
const path = require('path');

let options = {
    'ca': fs.readFileSync(path.join(__dirname, '../https/cert.pem')) // Only required because we are using a self signed certificate
}

let outboundMessage = 'ping';

var client = tls.connect(6000, options, function () {
    client.write(outboundMessage);
});

// When the server writes back log what it says then kill the client
client.on('data', function(inboundMessage) {
    let messageString = inboundMessage.toString();
    console.log('I wrote '+outboundMessage+' and they said '+messageString);
    client.end();
})