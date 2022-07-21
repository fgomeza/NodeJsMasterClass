/**
 * Example http2 client
 */


const http2 = require('http2');

// Create client
let client = http2.connect('http://localhost:6000');

let req = client.request({
    ':path': '/',
})

// When a message is received add the pieces of it together until you reach the end
let str = '';
req.on('data', function (chunk) {
    str+=chunk;
});

req.on('end', function() {
    console.log(str);
})

req.end();