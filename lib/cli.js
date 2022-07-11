/**
 * CLI related tasks
 */

// Dependencies
const readline = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');
class _events extends events{};
const e = new _events();
const codes = require('./consoleCodes');
const { processCheckOutcome } = require('./workers');

// Instantiate the CLI module object
let cli = {};

// Input handlers
e.on('man', function(str) {
    cli.responders.help();
})
e.on('help', function(str) {
    cli.responders.help();
})
e.on('exit', function(str) {
    cli.responders.exit();
})
e.on('stats', function(str) {
    cli.responders.stats();
})
e.on('list users', function(str) {
    cli.responders.listUsers();
})
e.on('more user info', function(str) {
    cli.responders.moreUserInfo(str);
})
e.on('list checks', function(str) {
    cli.responders.listChecks(str);
})
e.on('more check info', function(str) {
    cli.responders.moreCheckInfo(str);
})
e.on('list logs', function(str) {
    cli.responders.listLogs();
})
e.on('moreLogInfo', function(str) {
    cli.responders.moreLogInfo(str);
})

// Responders object
cli.responders = {}

cli.responders.help = function () {
    console.log("You asked for help")
}
cli.responders.exit = function () {
    console.log("You asked for exit")
}
cli.responders.stats = function () {
    console.log("You asked for stats")
}
cli.responders.listUsers = function () {
    console.log("You asked to list users")
}
cli.responders.moreUserInfo = function (str) {
    console.log("You asked for more user info", str)
}
cli.responders.listChecks = function (str) {
    console.log("You asked to list checks", str)
}
cli.responders.moreCheckInfo = function (str) {
    console.log("You asked for more check info", str)
}
cli.responders.listLogs = function () {
    console.log("You asked to list logs")
}
cli.responders.moreLogInfo = function (str) {
    console.log("You asked for more log info", str)
}

// Input processor
cli.processInput = function(str) {
    str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;
    // Only process the input if the user actually wrote something. Otherwise ignore.
    if (str) {
        // Codify the unique strings that identify the unique questions allowed to be asked.
        let uniqueInputs = [
            'man',
            'help',
            'exit',
            'stats',
            'list users',
            'more user info',
            'list checks',
            'more check info',
            'list logs',
            'more log info'
        ];

        // Go through the possible inputs, emit an event when a match is found.
        let matchFound = false;
        let counter = 0;
        uniqueInputs.some(function(input) {
            if (str.toLowerCase().indexOf(input) > -1) {
                matchFound = true;
                // Emit an event matching the unique input, and include the full string given
                e.emit(input, str);
                return true;
            }
        });

        // If no match is found, tell the user to try again
        if (!matchFound) {
            console.log("Sorry, try again")
        }
    }
}

// Init script
cli.init = function() {
    // Send the start message to the console, in dark blue
    console.log(codes.blue, `The CLI is running.`);

    // start the interface
    let _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '',
    });

    // Create an initial prompt
    _interface.prompt();

    // Handle each line of input separately
    _interface.on('line', function (str) {
        // Send to the input processor
        cli.processInput(str);

        // Re-initialize the prompt afterwards
        _interface.prompt();
    })

    // If the user stops the CLI, kill the associated process
    _interface.on('close', function () {
        process.exit(0);
    });
}

module.exports = cli;