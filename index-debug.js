/*
 * Primary file for the API
 *
 */

// Dependencies
const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');
const exampleDebuggingProblem = require('./lib/exampleDebuggingProblem');

// Declare the app
var app = {}

// Init function
app.init = function () {
    // Start the server
    debugger;
    server.init();
    debugger;

    // Start the workers
    debugger;
    workers.init();
    debugger;

    // Start the CLI, but make sure it starts last
    debugger;
    setTimeout(function() {
        cli.init();
        debugger;
    }, 50);
    debugger;

    debugger;
    var foo = 1;
    console.log('Just assigned 1 to foo');
    debugger;
    foo++;
    console.log('Just incremented foo');
    debugger;
    foo = foo * foo;
    console.log('Just squared foo');
    debugger;
    foo = foo.toString();
    console.log('Just converted foo to string');
    debugger;

    exampleDebuggingProblem.init();
    console.log('Just called the library');
    debugger;
};

// Execute
app.init();

// Export the app
module.exports = app;