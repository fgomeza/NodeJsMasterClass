/*
 * Server-related tasks
 *
 */

// Dependencies
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const StringDecoder = require('string_decoder').StringDecoder;
const url = require('url');
const util = require('util')
const debug = util.debuglog('server')

const config = require('../config');
const handlers = require('./handlers');
const helpers = require('./helpers');

// Instantiate the server module object
var server = {}

const app = {};

// Instanstiate the HTTP server
server.httpServer = http.createServer(function (req, res) {
    server.unifiedServer(req, res);
});

// Instantiate the HTTPS server
server.httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname, '../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '../https/cert.pem'))
};

server.httpsServer = https.createServer(server.httpsServerOptions, function (req, res) {
    server.unifiedServer(req, res);
});

// All the server logic for both the http and https server
server.unifiedServer = function (req, res) {

    // Get the URL and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');
    debug('Trimmed URL: ' + trimmedPath);

    // Get the query string as an object
    var queryStringObj = parsedUrl.query;

    // Get the HTTP Method
    var method = req.method.toUpperCase();

    // Get the headers as an object
    var headers = req.headers;

    // Get the payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });
    req.on('end', function() {
        buffer += decoder.end();

        // Choose the handler this request should go to. If one is not found, use the notFound handler
        var chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObj': queryStringObj,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer),
        };

        // Route the request to the handler specified in the router
        chosenHandler(data).catch(e => e).then(payload => {
            // Determine the type of response (fallback to JSON)
            var contentType = typeof(payload.contentType) == 'string' ? payload.contentType : 'json';

            // Use the status code called back by the handler, or default to 200
            var statusCode = typeof(payload.statusCode) == 'number' ? payload.statusCode : 200;


            // return the response parts that are content specific
            var payloadString = ''
            if (contentType == 'json') {
                res.setHeader('Content-Type', 'application/json');
                var payloadBody = typeof(payloadBody) == 'object' ? payloadBody : {}
                payloadString = JSON.stringify(payloadBody)
            }
            if (contentType == 'html') {
                res.setHeader('Content-Type', 'text/html');
                payloadString = typeof(payload.body) == 'string' ? payload.body : '';
                debug(typeof(payload.body));
                debug(payloadString);
            }

            //Return the response parts that are common to all content types
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the returned response
            // If the response is 200 print green, otherwise print red
            
            var printCode = '\x1b[32m%s\x1b[0m';
            if (statusCode != 200) {
                printCode = '\x1b[31m%s\x1b[0m'
            }
            debug(printCode, `${method.toUpperCase()} /${trimmedPath} ${statusCode}`)
            debug('Handler response:', payload);
        });

        // Log the request path
        // debug(`Request received on path: ${trimmedPath} with method: ${method} and with these query string parameters: `, queryStringObj);
        // debug('Request received with these headers: ', headers);
        // debug('Request recevied with this payload: ', buffer);
    });

}

// Define a request router
server.router = {
    '': handlers.index,
    'account/create': handlers.accountCreate,
    'account/edit': handlers.accountEdit,
    'account/deleted': handlers.accountDeleted,
    'session/create': handlers.sessionCreate,
    'session/deleted': handlers.sessionDeleted,
    'checks/all': handlers.checksList,
    'checks/create': handlers.checksCreate,
    'checks/edit': handlers.checksEdit,
    'ping': handlers.ping,
    'api/users': handlers.users,
    'api/tokens': handlers.tokens,
    'api/checks': handlers.checks
};

// Init script
server.init = function () {
    // Start the HTTP server and have it listen on port 3000
    server.httpServer.listen(config.httpPort, function() {
        //console.log('The server is listening on port ' + config.httpPort + ' in ' + config.envName + ' mode.');
        console.log('\x1b[36m%s\x1b[0m', `The server is listening on port ${config.httpPort} in ${config.envName} mode.`);

    });

    // Start the HTTPS server and have it listen on port 3000
    server.httpsServer.listen(config.httpsPort, function() {
        //console.log('The server is listening on port ' + config.httpsPort + ' in ' + config.envName + ' mode.');
        console.log('\x1b[35m%s\x1b[0m', `The server is listening on port ${config.httpsPort} in ${config.envName} mode.`);
    });


}


// Export the module
module.exports = server;
