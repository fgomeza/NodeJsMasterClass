/*
 *  Worker-related tasks
 *
 */

// Dependencies
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const url = require('url');
const util = require('util')
const debug = util.debuglog('workers')

const _data = require('./data');
const _logs = require('./logs')
const helpers = require('./helpers');

// Instantiate the worker object
var workers = {}

// Lookup all checks, get their data, send to a validator
workers.gatherAllChecks = function () {
    // Get all the checks
    _data.list('checks').then(checksFiles => {
        if (checksFiles && checksFiles.length > 0) {
            checksFiles.forEach(checkFile => {
                _data.read('checks', checkFile).then(checkData => {
                    // Pass it to the check validator, and let that function continue or log errors as needed
                    workers.validateCheckData(checkData);
                }, () => {
                    debug('Error reading one of the checks\'s data');
                })

            });
        } else {
            debug('Error: Could not find any checks to process');
        }
    })
};

// Sanity-check the check data
workers.validateCheckData = function(checkData) {
    checkData = typeof(checkData) == 'object' && checkData !== null ? checkData : {};
    checkData.id = typeof(checkData.id) == 'string' && checkData.id.trim().length == 20 ? checkData.id : false;
    checkData.userPhone = typeof(checkData.userPhone) == 'string' && checkData.userPhone.trim().length == 8 ? checkData.userPhone : false;
    checkData.protocol = typeof(checkData.protocol) == 'string' && ['http', 'https'].indexOf(checkData.protocol) > -1 ? checkData.protocol : false;
    checkData.url = typeof(checkData.url) == 'string' && checkData.url.trim().length > 0 ? checkData.url : false;
    checkData.method = typeof(checkData.method) == 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(checkData.method) > -1 ? checkData.method : false;
    checkData.successCodes = typeof(checkData.successCodes) == 'object' && checkData.successCodes instanceof Array && checkData.successCodes.length > 0 ? checkData.successCodes : false;
    checkData.timeoutSeconds = typeof(checkData.timeoutSeconds) == 'number' && checkData.timeoutSeconds % 1 === 0 && checkData.timeoutSeconds >= 1 && checkData.timeoutSeconds <= 5 ? checkData.timeoutSeconds : false;

    // Set the keys that may not be set (if the workers have never seen this check before)
    checkData.state = typeof(checkData.state) == 'string' && ['up', 'down'].indexOf(checkData.state) > -1 ? checkData.state : 'down';
    checkData.lastChecked = typeof(checkData.lastChecked) == 'number' && checkData.lastChecked > 0 ? checkData.lastChecked : false;

    // If all the checks pass, pass the data along to the next step in the process
    if (checkData.id && 
        checkData.userPhone &&
        checkData.protocol &&
        checkData.url &&
        checkData.method &&
        checkData.successCodes &&
        checkData.timeoutSeconds) {
            workers.performCheck(checkData);
    } else {
        debug('Error: One of the checks is not properly formatted. Skipping it.')
    }
}

// Perform the check, send the checkData and the outcome of the check process to the next step in the process
workers.performCheck = function (checkData) {
    // Prepare the initial check outcome
    var checkOutcome = {
        'error': false,
        'responseCode': false
    };

    // Mark that the outcome has not been sent yet
    var outcomeSent = false;

    // Parse the hostname and the path our of the original check data
    var parsedUrl = url.parse(checkData.protocol + '://' + checkData.url, true);
    var hostName = parsedUrl.hostname;
    var path = parsedUrl.path; // Using path and not "pathname" because we want the querystring
    
    // Constructing the request
    var requestDetails = {
        'protocol': checkData.protocol + ':',
        'hostname': hostName,
        'method': checkData.method,
        'path': path,
        'timeout': checkData.timeoutSeconds + 1000
    };

    // Instantiate the request object (using either the http or https module)
    var _moduleToUse = checkData.protocol == 'http' ? http : https;
    var req = _moduleToUse.request(requestDetails, function (res) {
        // Grab the status of the sent request
        var status = res.statusCode;

        // Update the checkoutcome and pass the data along
        checkOutcome.responseCode = status;

        if (!outcomeSent) {
            outcomeSent = true;
            workers.processCheckOutcome(checkData, checkOutcome);
        }
    });

    // Bind to the error event so it doesn't get thrown

    req.on('error', function (e) {
        // Update the checkoutcome and pass the data along
        checkOutcome.error = {
            'error': true,
            'value': e
        };

        if (!outcomeSent) {
            outcomeSent = true;
            workers.processCheckOutcome(checkData, checkOutcome);
        }
    });

    req.on('timeout', function (e) {
        // Update the checkoutcome and pass the data along
        checkOutcome.error = {
            'error': true,
            'value': 'timeout'
        };

        if (!outcomeSent) {
            outcomeSent = true;
            workers.processCheckOutcome(checkData, checkOutcome);
        }
    });

    // End the request
    req.end();
};

// Process the check outcome, update the check data as needed, trigger an alert if needed
// Special logic for accomodating a check that has never been tested before (don't alert on that one)
workers.processCheckOutcome = function (checkData, checkOutcome) {
    // Decide if the check is considered up or down
    var state = !checkOutcome.error && checkOutcome.responseCode && checkData.successCodes.indexOf(checkOutcome.responseCode) > -1
        ? 'up' : 'down';

    // Decide if an alert is warranted
    var alertWarranted = checkData.lastChecked && checkData.state != state
        ? true : false;

    // Log the outcome
    var timeOfCheck = Date.now();
    workers.log(checkData, checkOutcome, state, alertWarranted, timeOfCheck);

    // Update the check data
    var newCheckData = checkData;
    newCheckData.state = state;
    newCheckData.lastChecked = timeOfCheck;

    // Save the updates
    _data.update('checks', newCheckData.id, newCheckData)
    .then(() => {
        // Send the new check data to the next phase in the process if needed
        if (alertWarranted) {
            workers.alertUserToStatusChange(newCheckData);
        } else {
            debug('Check outcome has not changed, no alert needed');
        }
    }, () => {
        debug('Error trying to save updates to one of the checks');
    })
}

// Alert the user as to a change in their check status
workers.alertUserToStatusChange = function (newCheckData) {
    var msg = `Alert: Your check for ${newCheckData.method} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`;
    helpers.sendTwilioSms(newCheckData.userPhone, msg)
    .then(() => {
        debug(msg);
        debug('Success: User was alerted to a status change in their check via sms');
    }, () => {
        debug('Error: Could not send sms alert to user who had a state change in their check');
    })
};

workers.log = function(checkData, checkOutcome, state, alertWarranted, timeOfCheck) {
    // Form the log data
    var logData = {
        'check': checkData,
        'outcome': checkOutcome,
        'state': state,
        'alert': alertWarranted,
        'time': timeOfCheck
    };

    // Convert data to a string
    var logString = JSON.stringify(logData);

    // Determine the name of the log file
    var logFilename = checkData.id;

    // Append the log string to the file
    _logs.append(logFilename, logString)
    .then(() => debug('Logging to file succeeded'),
    err => debug('Logging to file failed.', err));
};

// Timer to execute the worker-process once per minute
workers.loop = function () {
    setInterval(function () {
        workers.gatherAllChecks();
    }, 1000 * 60);
};

// Rotate (compress) the log files
workers.rotateLogs = function () {
    // List all the (non compressed) log files
    _logs.list(false)
    .catch(err => { debug('Error: Could not find any logs to rotate. ', err); })
    .then(logs => {
        logs.forEach(function (logName) {
            // Compress the data to a different file
            var logId = logName.replace('.log', '');
            var newFileId = logId + '-' + Date.now();
            _logs.compress(logId, newFileId)
            .catch(err => { debug('Error compressing one of the log files. ', err); })
            .then(() => _logs.truncate(logId))
            .catch(err => { debug('Error truncating log file. ', err); })
            .then(() => { debug('Success truncating log file.'); });
        });
    })
}

// Timer to execute the log rotation process once per day
workers.logRotationLoop = function () {
    setInterval(function () {
        workers.rotateLogs();
    }, 1000 * 60 * 60 * 24);
}

// Init script
workers.init = function () {

    // Send to console, in yellow
    console.log('\x1b[33m%s\x1b[0m', 'Background workers are running');

    // Execute all the checks immediately
    workers.gatherAllChecks();

    // Call the loop so the checks will execute later on
    workers.loop();

    // Compress all the logs immediately
    workers.rotateLogs();

    // Call the compression loop so logs will be compressed later on
    workers.logRotationLoop();
};

// Export the module
module.exports = workers;
