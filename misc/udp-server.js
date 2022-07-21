/**
 * Example UDP Server
 * Creating a UDP datagram server listening on 6000
 */

const dgram = require('dgram');

let server = dgram.createSocket('udp4');

server.on('message', function(messageBuffer, sender) {
    let messageString = messageBuffer.toString();
    console.log(messageString);
})

server.bind(6000);