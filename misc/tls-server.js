/**
 * Example TLS Server
 * Listens to port 6000 and sends the word "pong" to clients
 */

// Dependencies
const tls = require('tls');
const fs = require('fs');
const path = require('path');

let options = {
    'key': fs.readFileSync(path.join(__dirname, '../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '../https/cert.pem'))
}

let server = tls.createServer(options, function(connection) {
    let outboundMessage = 'pong';
    connection.write(outboundMessage);

    connection.on('data', function(inboundMessage) {
        let messageString = inboundMessage.toString();
        console.log('I wrote '+outboundMessage+' and they said '+messageString);
    })
});


server.listen(6000);