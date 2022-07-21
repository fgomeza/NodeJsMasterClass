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
const os = require('os');
const v8 = require('v8');
const _data = require('./data');
const _logs = require('./logs');
const helpers = require('./helpers');
const childProcess = require('child_process');

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
e.on('quit', function(str) {
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
e.on('more log info', function(str) {
    cli.responders.moreLogInfo(str);
})

// Responders object
cli.responders = {}

cli.responders.exit = function () {
    process.exit(0);
}

cli.responders.help = function () {
    let commands = {
        'exit': 'Kill the CLI (and the rest of the application',
        'quit': 'Kill the CLI (and the rest of the application',
        'man': 'Show this help page',
        'help': 'Show this help page',
        'stats': 'Get statistics on the underlying operating system and resource utilization',
        'list users': 'Show a list of all the registered (undeleted) users in the system',
        'more user info --{userId}': 'Show details of a specific user',
        'list checks --up --down': 'Show a list of all the active checks in the system, including their state. The "--up" and "--down" flags are both optional',
        'more check info --{checkId}': 'Show details of a specified check',
        'list logs': 'Show a list of all the log files available to be read (compressed only)',
        'more log info --filename': 'Show details of a specified log file',
    };

    // Show the header for the help page that is as wide as the screen

    cli.horizontalLine();
    cli.centered('CLI MANUAL');
    cli.horizontalLine();
    cli.verticalSpace(2);

    // Show each command followed by its explanation in white and yellow respectively
    for (let key in commands) {
        if (commands.hasOwnProperty(key)) {
            let value = commands[key];
            let line = '\x1b[33m'+key+'\x1b[0m';
            let padding = 40 - line.length;
            for (let i=0; i<padding; i++) {
                line+=' ';
            }
            line+=value;
            console.log(line);
            cli.verticalSpace()
        }
    }

    cli.verticalSpace(1);

    // End with another horizontal line
    cli.horizontalLine();
}

// Create a vertical space
cli.verticalSpace = function(lines) {
    lines = typeof(lines) == 'number' && lines > 0 ? lines : 1;
    for (let i=0; i<lines; i++) {
        console.log('');
    }
}

// Create a horizontal line across the screen
cli.horizontalLine = function() {
    // Get the available screen size
    var width = process.stdout.columns;

    let line = '';
    for (let i=0; i<width; i++) {
        line+='-'
    }
    console.log(line);
}

// Create centered text on the screen
cli.centered = function (str) {
    str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : '';

    // Get the available screen size
    let width = process.stdout.columns;

    // Calculate the left padding there should be
    let leftPadding = Math.floor((width - str.length) / 2)

    // Put in left padded spaces before the string itself
    var line = ''
    for(let i=0; i<leftPadding; i++) {
        line+=' ';
    }
    line+=str;
    console.log(line);
}

cli.responders.stats = function () {
    // Compile an object of stats
    let stats = {
        'Load Average': os.loadavg().join(' '),
        'CPU Count': os.cpus().length,
        'Free Memory': os.freemem(),
        'Current Melloced Memory': v8.getHeapStatistics().malloced_memory,
        'Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
        'Allocated Heap Used (%)': Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size)*100),
        'Available Heap Allocated (%)': Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit)*100),
        'Uptime': os.uptime() + ' Seconds'
    }

    // Create a header for the stats
    cli.horizontalLine();
    cli.centered('SYSTEM STATISTICS');
    cli.horizontalLine();
    cli.verticalSpace(2);

    // Log out each stat
    for (let key in stats) {
        if (stats.hasOwnProperty(key)) {
            let value = stats[key];
            let line = '\x1b[33m'+key+'\x1b[0m';
            let padding = 40 - line.length;
            for (let i=0; i<padding; i++) {
                line+=' ';
            }
            line+=value;
            console.log(line);
            cli.verticalSpace()
        }
    }

    cli.verticalSpace(1);

    // End with another horizontal line
    cli.horizontalLine();

}

// List users
cli.responders.listUsers = function () {
    _data.list('users').then(userIds => {
        cli.verticalSpace()
        userIds.forEach(userId => {
            _data.read('users', userId).then(userData => {
                let numberOfChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array && userData.checks.length > 0 ? userData.checks.length : 0;
                let line = `Name: ${userData.firstName} ${userData.lastName} Phone: ${userData.phone} Checks: ${numberOfChecks}`;
                console.log(line);
                cli.verticalSpace();
            })
        });
    })
}

// More user info
cli.responders.moreUserInfo = function (str) {
    // Get the ID from the string
    let arr = str.split('--');
    let userId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    if (userId) {
        _data.read('users', userId).then(userData => {
            // Remove the hashed password
            delete userData.hashedPassword;

            // Print the JSON with text highlighting
            cli.verticalSpace();
            console.dir(userData, {'colors': true});
            cli.verticalSpace();
        })
    } else {
        console.log('Please see \'help\' for syntax');
    }
}

// list checks
cli.responders.listChecks = function (str) {
    _data.list('checks').then(checkIds => {
        cli.verticalSpace();
        checkIds.forEach(checkId => {
            _data.read('checks', checkId).then(checkData => {
                let includeCheck = false;
                let lowerString = str.toLowerCase();

                // Get the state, default to down
                let state = typeof(checkData.state) == 'string' ? checkData.state : 'down';
                // Get the state, default to unknown
                let stateOrUnknown = typeof(checkData.state) == 'string' ? checkData.state : 'unknown';
                // If the user has specified the state, or hasn't specified any state, include the current check accordingly.
                if(lowerString.indexOf('--'+state) > -1 || lowerString.indexOf('--down') == -1 && lowerString.indexOf('--up') == -1) {
                    let line = `ID: ${checkData.id} ${checkData.method.toUpperCase()} ${checkData.protocol}://${checkData.url} State: ${stateOrUnknown}`
                    console.log(line);
                    cli.verticalSpace();
                }
            })
        })
    }) 
}

// more check info
cli.responders.moreCheckInfo = function (str) {
    // Get the ID from the string
    let arr = str.split('--');
    let checkId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    if (checkId) {
        _data.read('checks', checkId).then(checkData => {
            // Print the JSON with text highlighting
            cli.verticalSpace();
            console.dir(checkData, {'colors': true});
            cli.verticalSpace();
        })
    } else {
        console.log('Please see \'help\' for syntax');
    }
}

// list logs
cli.responders.listLogs_old = function () {
    _logs.list(true).then(logFileNames => {
        if (logFileNames && logFileNames.length > 0) {
            logFileNames.forEach(logfilename => {
                if(logfilename.indexOf('-') > -1) {
                    console.log(logfilename);
                    cli.verticalSpace();
                }
            })
        }
    })
}

// list logs with child process
cli.responders.listLogs = function () {
    let ls = childProcess.spawn('ls', ['./.logs/']);
    ls.stdout.on('data', function (dataObj) {
        // Explode into separate lines
        let dataStr = dataObj.toString();
        let logFileNames = dataStr.split('\n');

        logFileNames.forEach(logfilename => {
            if(typeof(logfilename) == 'string' && logfilename.length > 0 && logfilename.indexOf('-') > -1) {
                console.log(logfilename.trim().split('.')[0]);
                //cli.verticalSpace();
            }
        })
    }) 
}

// more log info
cli.responders.moreLogInfo = function (str) {
    // Get the ID from the string
    let arr = str.split('--');
    let logFilename = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    if (logFilename) {
        cli.verticalSpace();
        // Decompress the log
        _logs.decompress(logFilename).then(strData => {
            // Split into lines
            let arr = strData.split('\n');
            arr.forEach(jsonString => {
                let logObject = helpers.parseJsonToObject(jsonString);
                if (logObject && JSON.stringify(logObject) !== '{}') {
                    console.dir(logObject, {'colors': true});
                    cli.verticalSpace();
                }
            })
        })
    } else {
        console.log('Please see \'help\' for syntax');
    }
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
            'quit',
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