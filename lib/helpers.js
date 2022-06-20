/*
 * Helpers for various tasks
 */

// Dependencies
const crypto = require('crypto');
const fsPromises = require('fs').promises;
const https = require('https');
const path = require('path');
const querystring = require('querystring');
const util = require('util');
const debug = util.debuglog('helpers');

const config = require('../config');


// Container for all the helpers
var helpers = {};

// Create a SHA256 hash
helpers.hash = function(str) {
    if (typeof(str) == 'string' && str.length > 0) {
        var hash = crypto.createHmac('sha256', config.hashingSecret)
            .update(str)
            .digest('hex');
        return hash;
    } else {
        return false;
    }
}

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(jsonAsText) {
    try {
        return JSON.parse(jsonAsText);
    } catch(e) {
        return {}
    }
}

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function(strLength) {
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if (strLength) {
        // Define all the possible characters that could go into a string
        var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

        // Start the final string
        var str = '';
        for (i = 1; i <= strLength; i++) {
            // Get a random character from the possibleCharacters string
            var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));

            // Append this character to the final string
            str += randomCharacter;
        }

        return str;
    } else {
        return false;
    }
}

helpers.validResponse = function (statusCode, body) {
    if (body) {
        return Promise.resolve({'statusCode': statusCode, 'body': body});
    } else {
        return Promise.resolve({'statusCode': statusCode});
    }
}

helpers.errorResponse = function (statusCode, errorMessage) {
    if (errorMessage) {
        return Promise.reject({'statusCode': statusCode, 'body': {'error': errorMessage}});
    } else {
        return Promise.reject({'statusCode': statusCode});
    }
}

// Send an SMS message via Twilio
helpers.sendTwilioSms = function (phone, msg) {
    phone = typeof(phone) == 'string' && phone.trim().length == 8 ? phone.trim() : false;
    msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
    if (phone && msg) {
        // Configure the request payload
        var payload = {
            'From': config.twilio.fromPhone,
            'To': '+506' + phone,
            'Body': msg
        };

        // Stringify the payload
        var stringPayload = querystring.stringify(payload);

        // Configure the request details
        var requestDetails = {
            'protocol': 'https:',
            'hostname': 'api.twilio.com',
            'method': 'POST',
            'path': '/2010-04-01/Accounts/' + config.twilio.accountSid + '/Messages.json',
            'auth': config.twilio.accountSid + ':' + config.twilio.authToken,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-length': Buffer.byteLength(stringPayload)
            }
        };

        return new Promise(function (resolve, reject) {
            // Instantiate the request object
            var req = https.request(requestDetails, function(res) {
    
                // Grab the status of the sent request
                var status = res.statusCode;
        
                if (status == 200 || status == 201) {
                    return resolve();
                } else {
                    return reject('Status code returned was ' + status)
                }
            });
    
            // Bind to the error event so it doesn't get thrown
            req.on('error', function(e) {
                return reject(e);
            })
    
            // Add the payload
            req.write(stringPayload);
    
            // End the request
            req.end();
        });
    } else {
        return Promise.reject('Given parameters were missing or invalid')
    }
}

// Get the string content of a template
helpers.getTemplate = function (templateName, data) {
    templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false
    data = typeof(data) == 'object' && data !== null ? data : {};

    return new Promise(function(resolve, reject) {
        if (templateName) {
            var templatesDir = path.join(__dirname + '/../templates/');
            fsPromises.readFile(templatesDir + templateName + '.html', 'utf8')
            .catch(err => reject('No template could be found. ' + err.message))
            .then(str => {
                let finalString = helpers.interpolate(str, data)
                resolve(finalString);
            });
        } else {
            reject('A valid template name was not specified');
        }
    });

}

// Add the universal header and footer to a string, and pass provided data object to the header and footer for interpolation.
helpers.addUniversalTemplates = function (str, data) {
    str = typeof(str) == 'string' && str.length > 0 ? str : '';
    data = typeof(data) == 'object' && data !== null ? data : {};

    return new Promise(function (resolve, reject) {
        // Get the header
        Promise.all([helpers.getTemplate('_header', data), helpers.getTemplate('_footer', data)])
        .catch(err => {
            debug('Error getting template. ' + err);
            reject({ statusCode: 500, contentType: 'html' });
        })
        .then(([headerString, footerString]) => resolve(headerString + str + footerString));
    });
}

// Take a given string and a data object and find/replace all the keys within it
helpers.interpolate = function(str, data) {
    str = typeof(str) == 'string' && str.length > 0 ? str : '';
    data = typeof(data) == 'object' && data !== null ? data : {};

    // Add the templateGlobals to the data object, prepending their key name with "global"
    for (let keyName in config.templateGlobals) {
        if (config.templateGlobals.hasOwnProperty(keyName)) {
            data['global.' + keyName] = config.templateGlobals[keyName];
        }
    }

    // For each key in the data object, insert its value into the string t the corresponding placeholder.
    for (let key in data) {
        if (data.hasOwnProperty(key) && typeof(data[key]) == 'string') {
            let replace = data[key];
            let find = '{' + key + '}'
            str = str.replace(find, replace);
        }
    }

    return str;
}

// Export the module
module.exports = helpers;
