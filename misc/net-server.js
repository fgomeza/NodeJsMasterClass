/**
 * Example TCP (Net) Server
 * Listens to port 6000 and sends the word "pong" to clients
 */

// Dependencies
const net = require('net');

let server = net.createServer(function(connection) {
    let outboundMessage = 'pong';
    connection.write(outboundMessage);

    connection.on('data', function(inboundMessage) {
        let messageString = inboundMessage.toString();
        console.log('I wrote '+outboundMessage+' and they said '+messageString);
    })
});


server.listen(6000);