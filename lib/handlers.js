/*
 * Request handlers
 */

//Dependencies
const util = require('util');
const debug = util.debuglog('handlers');

const _data = require('./data');
const { validResponse, errorResponse } = require('./helpers');
const config = require('./config');
const helpers = require('./helpers');
const _url = require('url')
const dns = require('dns')

const TOKEN_LENGTH = 20;

// Define the handlers
var handlers = {};

/**
 * HTML Handlers
 * 
 * 
 */
// Index handler
handlers.index = function(data) {
    return new Promise(function (resolve, reject) {
        // Reject any request that isn't a GET
        if (data.method == 'GET') {

            // Prepare data for interpolation
            var templateData = {
                'head.title': 'Uptime Monitoring - Made Simple',
                'head.description': 'We offer free, simple uptime monitoring for HTTP/HTTPS sites of all kinds. When your site goes down, we\'ll send you a text to let you know',
                'body.class': 'index'
            };

            // Read in a template as a string
            helpers.getTemplate('index', templateData)
            .then(template => helpers.addUniversalTemplates(template, templateData))
            .catch(err => {
                debug('Error getting template. ' + err);
                reject({ statusCode: 500, contentType: 'html' });
            })
            .then((template) => {
                resolve({ contentType: 'html', statusCode: 200, body: template })
            })
        } else {
            reject({ statusCode: 405, contentType: 'html' });
        }
    })
}

// Create Account
handlers.accountCreate = function(data) {
    return new Promise(function (resolve, reject) {
        // Reject any request that isn't a GET
        if (data.method == 'GET') {

            // Prepare data for interpolation
            var templateData = {
                'head.title': 'Create an account',
                'head.description': 'Signup is easy and only takes a few seconds.',
                'body.class': 'accountCreate'
            };

            // Read in a template as a string
            helpers.getTemplate('accountCreate', templateData)
            .then(template => helpers.addUniversalTemplates(template, templateData))
            .catch(err => {
                debug('Error getting template. ' + err);
                reject({ statusCode: 500, contentType: 'html' });
            })
            .then((template) => {
                resolve({ contentType: 'html', statusCode: 200, body: template })
            })
        } else {
            reject({ statusCode: 405, contentType: 'html' });
        }
    })
}

// Create New Session
handlers.sessionCreate = function(data) {
    return new Promise(function (resolve, reject) {
        // Reject any request that isn't a GET
        if (data.method == 'GET') {

            // Prepare data for interpolation
            var templateData = {
                'head.title': 'Login to your account',
                'head.description': 'Please enter your phone number and password to access your account.',
                'body.class': 'sessionCreate'
            };

            // Read in a template as a string
            helpers.getTemplate('sessionCreate', templateData)
            .then(template => helpers.addUniversalTemplates(template, templateData))
            .catch(err => {
                debug('Error getting template. ' + err);
                reject({ statusCode: 500, contentType: 'html' });
            })
            .then((template) => {
                resolve({ contentType: 'html', statusCode: 200, body: template })
            })
        } else {
            reject({ statusCode: 405, contentType: 'html' });
        }
    })
}


// Session has been deleted
handlers.sessionDeleted = function(data) {
    return new Promise(function (resolve, reject) {
        // Reject any request that isn't a GET
        if (data.method == 'GET') {

            // Prepare data for interpolation
            var templateData = {
                'head.title': 'Logged Out',
                'head.description': 'You have been logged out of your account.',
                'body.class': 'sessionDeleted'
            };

            // Read in a template as a string
            helpers.getTemplate('sessionDeleted', templateData)
            .then(template => helpers.addUniversalTemplates(template, templateData))
            .catch(err => {
                debug('Error getting template. ' + err);
                reject({ statusCode: 500, contentType: 'html' });
            })
            .then((template) => {
                resolve({ contentType: 'html', statusCode: 200, body: template })
            })
        } else {
            reject({ statusCode: 405, contentType: 'html' });
        }
    })
}

handlers.accountEdit = function(data) {
    return new Promise(function (resolve, reject) {
        // Reject any request that isn't a GET
        if (data.method == 'GET') {

            // Prepare data for interpolation
            var templateData = {
                'head.title': 'Account Settings',
                'body.class': 'accountEdit'
            };

            // Read in a template as a string
            helpers.getTemplate('accountEdit', templateData)
            .then(template => helpers.addUniversalTemplates(template, templateData))
            .catch(err => {
                debug('Error getting template. ' + err);
                reject({ statusCode: 500, contentType: 'html' });
            })
            .then((template) => {
                resolve({ contentType: 'html', statusCode: 200, body: template })
            })
        } else {
            reject({ statusCode: 405, contentType: 'html' });
        }
    })
}

handlers.accountDeleted = function(data) {
    return new Promise(function (resolve, reject) {
        // Reject any request that isn't a GET
        if (data.method == 'GET') {

            // Prepare data for interpolation
            var templateData = {
                'head.title': 'Account Deleted',
                'head.description': 'Your account has been deleted',
                'body.class': 'accountDeleted'
            };

            // Read in a template as a string
            helpers.getTemplate('accountDeleted', templateData)
            .then(template => helpers.addUniversalTemplates(template, templateData))
            .catch(err => {
                debug('Error getting template. ' + err);
                reject({ statusCode: 500, contentType: 'html' });
            })
            .then((template) => {
                resolve({ contentType: 'html', statusCode: 200, body: template })
            })
        } else {
            reject({ statusCode: 405, contentType: 'html' });
        }
    })
}

handlers.checksCreate = function(data) {
    return new Promise(function (resolve, reject) {
        // Reject any request that isn't a GET
        if (data.method == 'GET') {

            // Prepare data for interpolation
            var templateData = {
                'head.title': 'Create a new check',
                'body.class': 'checksCreate'
            };

            // Read in a template as a string
            helpers.getTemplate('checksCreate', templateData)
            .then(template => helpers.addUniversalTemplates(template, templateData))
            .catch(err => {
                debug('Error getting template. ' + err);
                reject({ statusCode: 500, contentType: 'html' });
            })
            .then((template) => {
                resolve({ contentType: 'html', statusCode: 200, body: template })
            })
        } else {
            reject({ statusCode: 405, contentType: 'html' });
        }
    })
}

handlers.checksList = function(data) {
    return new Promise(function (resolve, reject) {
        // Reject any request that isn't a GET
        if (data.method == 'GET') {

            // Prepare data for interpolation
            var templateData = {
                'head.title': 'Dashboard',
                'body.class': 'checksList'
            };

            // Read in a template as a string
            helpers.getTemplate('checksList', templateData)
            .then(template => helpers.addUniversalTemplates(template, templateData))
            .catch(err => {
                debug('Error getting template. ' + err);
                reject({ statusCode: 500, contentType: 'html' });
            })
            .then((template) => {
                resolve({ contentType: 'html', statusCode: 200, body: template })
            })
        } else {
            reject({ statusCode: 405, contentType: 'html' });
        }
    })
}

handlers.checksEdit = function(data) {
    return new Promise(function (resolve, reject) {
        // Reject any request that isn't a GET
        if (data.method == 'GET') {

            // Prepare data for interpolation
            var templateData = {
                'head.title': 'Check Details',
                'body.class': 'checksEdit'
            };

            // Read in a template as a string
            helpers.getTemplate('checksEdit', templateData)
            .then(template => helpers.addUniversalTemplates(template, templateData))
            .catch(err => {
                debug('Error getting template. ' + err);
                reject({ statusCode: 500, contentType: 'html' });
            })
            .then((template) => {
                resolve({ contentType: 'html', statusCode: 200, body: template })
            })
        } else {
            reject({ statusCode: 405, contentType: 'html' });
        }
    })
}

// Favicon
handlers.favicon = function (data) {
    return new Promise(function (resolve, reject) {
        // Reject any request that isn't a GET
        if (data.method == 'GET') {
            helpers.getStaticAsset('favicon.ico')
            .catch(err => {
                debug('Error getting static asset favicon. ' + err)
                reject({ statusCode: 500, contentType: 'html' });
            }).then(data => resolve({ contentType: 'favicon', statusCode: 200, body: data }))
        } else {
            reject({ statusCode: 405, contentType: 'html' });
        }
    });
}

// Public assets
handlers.public = function (data) {
    return new Promise(function (resolve, reject) {
        // Reject any request that isn't a GET
        if (data.method == 'GET') {
            // Get the filename being requested
            let trimmedAssetName = data.trimmedPath.replace('public/', '').trim()
            if (trimmedAssetName.length > 0) {
                helpers.getStaticAsset(trimmedAssetName)
                .catch(err => {
                    debug('Error getting static asset favicon. ' + err)
                    reject({ statusCode: 500, contentType: 'html' });
                }).then(data => {
                    let contentType = 'plain'
                    if (trimmedAssetName.indexOf('.css') > -1) {
                        contentType = 'css';
                    }
                    if (trimmedAssetName.indexOf('.png') > -1) {
                        contentType = 'png';
                    }
                    if (trimmedAssetName.indexOf('.jpg') > -1) {
                        contentType = 'jpg';
                    }
                    if (trimmedAssetName.indexOf('.ico') > -1) {
                        contentType = 'favicon';
                    }
                    resolve({ contentType: contentType, statusCode: 200, body: data })
                });
            } else {
                reject({ statusCode: 404, contentType: 'html' });
            }
        } else {
            reject({ statusCode: 405, contentType: 'html' });
        }
    })
}

/**
 * JSON API Handlers
 * 
 * 
 */

// Example error
handlers.exampleError = function (data) {
    let err = new Error('This is an example error');
    throw(err);
}



handlers.users = function(data) {
    var acceptableMethods = ['POST', 'GET', 'PUT', 'DELETE'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        return handlers._users[data.method](data);
    } else {
        return errorResponse(405);
    }
}

// Container for the users submethods
handlers._users = {};

// Users - POST
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.POST = function(data) {
    // Check that all required fields are filled out
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ?
        data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ?
        data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ?
        data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ?
        data.payload.password.trim() : false;
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ?
        true : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure that the user doesn't already exist
        return _data.read('users', phone)
        .then(() => {
            return errorResponse(400, 'A user with that phone number already exists');
        }, () => {
            // Hash the password
            var hashedPassword = helpers.hash(password);

            if (hashedPassword) {
                // Create user object
                var userObj = {
                    'firstName': firstName,
                    'lastName': lastName,
                    'phone': phone,
                    'hashedPassword': hashedPassword,
                    'tosAgreement': true
                };

                // Store the user
                return _data.create('users', phone, userObj)
                .then(() => {
                    delete userObj.hashedPassword;
                    return validResponse(200, userObj);
                }, err => {
                    console.error(err);
                    return errorResponse(500, 'Could not create the new user');
                })
            } else {
                return errorResponse(500, 'Could not hash the user\'s password');
            }
        });
    } else {
        return errorResponse(400, 'Missing required fields');
    }

}

// Users - GET
// Required data: phone
// Optional data: none
handlers._users.GET = function(data) {
    // Check that the phone number is valid
    var phone = typeof(data.queryStringObj.phone) == 'string' && data.queryStringObj.phone.trim().length == 10 ? data.queryStringObj.phone.trim() : false;
    if (phone) {

        // Get the token from the headers
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

        // verify that the given token is valid for the phone number
        return handlers._tokens.verifyToken(token, phone)
        .then(tokenIsValid => {
            if (tokenIsValid) {
                // Lookup the user
                return _data.read('users', phone)
                .then(data => {
                    // Remove the hashed password from the user object before returning it to the requestor.
                    delete data.hashedPassword;
                    return validResponse(200, data);
                }, () => errorResponse(404));
            } else {
                return errorResponse(403, 'Missing required token in header or token is invalid');
            }
        });
    } else {
        return errorResponse(400, 'Missing required field');
    }
}
// Users - PUT
// Required data: phone
// Optional data: firstName, lastName, password (at least one must be specified).
handlers._users.PUT = function(data) {
    // Check for the requried field
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ?
        data.payload.phone.trim() : false;

    // Check for the optional fields
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ?
        data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ?
        data.payload.lastName.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ?
        data.payload.password.trim() : false;
    
        // Error if the phone is invalid
    if (phone) {
        // Error if nothing is sent to update
        if (firstName || lastName || password) {

            // Get the token from the headers
            var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

            // verify that the given token is valid for the phone number
            return handlers._tokens.verifyToken(token, phone)
            .then(tokenIsValid => {
                if (tokenIsValid) {

                    // Lookup the user
                    return _data.read('users', phone)
                    .then(userData => {
                        // Update the fields necessary
                        if (firstName) {
                            userData.firstName = firstName;
                        }
                        if (lastName) {
                            userData.lastName = lastName;
                        }
                        if (password) {
                            userData.hashedPassword = helpers.hash(password);
                        }

                        // Store the new updates
                        return _data.update('users', phone, userData)
                        .then(() => validResponse(200), err => {
                            console.log('Error updating user. ' + err.message);
                            return errorResponse(500, 'Could not update the user');
                        })
                    }, () => {
                        return errorResponse(400, 'The specified user does not exist');
                    });
                } else {
                    return errorResponse(403, 'Missing required token in header or token is invalid');
                }
            });

        } else {
            return errorResponse(400, 'Missing fields to update');
        }
    } else {
        return errorResponse(400, 'Missing required field');
    }

}

// Users - DELETE
// Required field: phone
// @TODO Cleanup (delete) any other data files associated with this user.
handlers._users.DELETE = function(data) {
    // Check that the phone number is valid
    var phone = typeof(data.queryStringObj.phone) == 'string' && data.queryStringObj.phone.trim().length == 10 ? data.queryStringObj.phone.trim() : false;
    if (phone) {

        // Get the token from the headers
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

        // verify that the given token is valid for the phone number
        return handlers._tokens.verifyToken(token, phone)
        .then(tokenIsValid => {
            if (tokenIsValid) {
                // Lookup the user
                return _data.read('users', phone)
                .then(userData => {
                    return _data.delete('users', phone)
                    .then(() => {
                        var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                        var checksToDelete = userChecks.length;
                        if (checksToDelete > 0) {
                            // Loop through the checks
                            return Promise.all(userChecks.map(checkId => _data.delete('checks', checkId)))
                            .then(
                                () => validResponse(200),
                                () => errorResponse(500, 'Error encountered while attempting to delete user checks. All checks may not have been deleted fromm the system successfully.'));
                        } else {
                            return validResponse(200);
                        }
                    }, err => {
                        console.log('Could not delete user.', err);
                        return errorResponse(500, 'Could not delete the specified user');
                    });
                }, () => {
                    return errorResponse(400, 'Could not find the specified user');
                });
            } else {
                return errorResponse(403, 'Missing required token in header or token is invalid');
            }
        });
    } else {
        return errorResponse(400, 'Missing required field');
    }
}

handlers.tokens = function(data) {
    var acceptableMethods = ['POST', 'GET', 'PUT', 'DELETE'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        return handlers._tokens[data.method](data);
    } else {
        return errorResponse(405);
    }
}

// Container for all the tokens methods
handlers._tokens = {};

// Tokens - POST
// Required data: phone, password
// Optional data: none
handlers._tokens.POST = function(data) {
    // Check that all required fields are filled out
   var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ?
        data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ?
        data.payload.password.trim() : false;

    if (phone && password) {
        // Lookup the user who matches that phone number
        return _data.read('users', phone)
        .then((userData) => {
            // Hash the password
            var hashedPassword = helpers.hash(password);

            if (hashedPassword == userData.hashedPassword) {
                // If valid, create a new token with a random name. Set expiration date 1 hour in the future.
                var tokenObj = {
                    'phone': phone,
                    'id': helpers.createRandomString(TOKEN_LENGTH),
                    'expires': Date.now() + 1000 * 60 * 60
                };

                // Store the user
                return _data.create('tokens', tokenObj.id, tokenObj)
                    .catch(err => {
                        console.error(err);
                        return errorResponse(500, 'Could not create the new user');
                    }).then(() => validResponse(200, tokenObj));
            } else {
                return errorResponse(400, 'Password did not match the specified user\'s password.');
            }
        }, () => {
            return errorResponse(400, 'Could not find the specified user');
        });
    } else {
        return errorResponse(400, 'Missing required fields');
    }

}

// Tokens - GET
// Required data: id
// Optional data: none
handlers._tokens.GET = function(data) {
    // Check that the id is valid
    var id = typeof(data.queryStringObj.id) == 'string' && data.queryStringObj.id.trim().length == TOKEN_LENGTH ? data.queryStringObj.id.trim() : false;
    if (id) {
        // Lookup the user
        return _data.read('tokens', id).then(tokenData => {
            // Remove the hashed password from the user object before returning it to the requestor.
            return validResponse(200, tokenData);
        }, (err) => {
            return errorResponse(404);
        });
    } else {
        return errorResponse(400, 'Missing required field');
    }
}
// Tokens - PUT
// Required data: id, extend
// Optional data: none
handlers._tokens.PUT = function(data) {
    // Check for the requried field
    var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == TOKEN_LENGTH ?
        data.payload.id.trim() : false;
    var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ?
        true : false;

    if (id && extend) {
        // Lookup the token
        return _data.read('tokens', id).then(tokenData => {
            // Check to make sure the tokens isn't already expired
            if (tokenData.expires > Date.now()) {
                // Set the expiration an hour from now
                tokenData.expires = Date.now() + 1000 * 60 * 60;

                // Store the new updates
                return _data.update('tokens', id, tokenData).then(() => {
                    return validResponse(200);
                }, err => {
                    console.log('Error updating user. ' + err.message);
                    return errorResponse(500, 'Could not update the token\'s expiration');
                })
            } else {
                return errorResponse(400, 'The token has already expired, and cannot be extended');
            }
        }, () => {
            return errorResponse(400, 'Specified token does not exist');
        });
    } else {
        return errorResponse(400, 'Missing required field(s) or field(s) are invalid');
    }

}

// Tokens - DELETE
// Required field: id
// Optional fields: none
handlers._tokens.DELETE = function(data) {
    // Check that the id is valid
    var id = typeof(data.queryStringObj.id) == 'string' && data.queryStringObj.id.trim().length == TOKEN_LENGTH ?
        data.queryStringObj.id.trim() : false;
    if (id) {
        // Lookup the token
        return _data.read('tokens', id).then(() => {
            return _data.delete('tokens', id).then(() => {
                return validResponse(200);
            }, err => {
                console.log('Could not delete token.', err);
                return errorResponse(500, 'Could not delete the specified token');
            });
        }, (err) => {
            return errorResponse(400, 'Could not find the specified token');
        });
    } else {
        return errorResponse(400, 'Missing required field');
    }
}

// Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = function (id, phone) {
    // Lookup the token
    return _data.read('tokens', id)
    .then(tokenData =>
        (tokenData.phone == phone && tokenData.expires > Date.now()),
        () => false
    );
}

handlers.checks = function(data) {
    var acceptableMethods = ['POST', 'GET', 'PUT', 'DELETE'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        return handlers._checks[data.method](data);
    } else {
        return errorResponse(405);
    }
}

// Container for the checks submethods
handlers._checks = {};

// Checks - POST
// Required data: protocol, url, method, successCodes, timeoutSeconds
// Optional data: none
handlers._checks.POST = function(data) {
    // Validate inputs
   var protocol = typeof(data.payload.protocol) == 'string' && ['http', 'https'].indexOf(data.payload.protocol.trim()) > -1 ? data.payload.protocol.trim() : false;
   var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length  > 0 ? data.payload.url.trim() : false;
   var method = typeof(data.payload.method) == 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(data.payload.method.trim().toUpperCase()) > -1 ? data.payload.method.trim().toUpperCase() : false;
   var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
   var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 &&  data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

    if (protocol && url && method && successCodes && timeoutSeconds) {
        // Get the token from the headers
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

        // Lookup the user by reading the token
        return _data.read('tokens', token)
        .then(tokenData => {
            var userPhone = tokenData.phone;
            return _data.read('users', userPhone)
            .then(userData => {
                var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ?
                    userData.checks : [];
                // Verify that the user has less than the number of max-checks-per-user.
                if (userChecks.length < config.maxChecks) {

                    // Verify that the URL given has DNS entries (and therefore can resolve)
                    let parsedUrl = _url.parse(protocol+'://'+url, true);
                    let hostname = typeof(parsedUrl.hostname) == 'string' && parsedUrl.hostname.length > 0 ? parsedUrl.hostname : false;
                    dns.resolve(hostname, function (err, records) {
                        if (!err && records) {
                            // TODO: Create check only if records exist
                        } else {
                        }
                    })

                    // Create a random id for the check
                    var checkId = helpers.createRandomString(20);

                    // Create the check object, and include the user's phone
                    var checkObject = {
                        'id': checkId,
                        'userPhone': userPhone,
                        'protocol': protocol,
                        'url': url,
                        'method': method,
                        'successCodes': successCodes,
                        'timeoutSeconds': timeoutSeconds
                    };

                    // Save the object
                    return _data.create('checks', checkId, checkObject)
                    .then(() => {
                        // Add the check id to the user's object
                        userData.checks = userChecks;
                        userData.checks.push(checkId);

                        // Save the new user data
                        return _data.update('users', userPhone, userData)
                        .then(
                            () => validResponse(200, checkObject),
                            () => errorResponse(500, 'Could not update the user with the new check')
                        );
                    }, () => errorResponse(500, 'Could not create the new check'));
                } else {
                    return errorResponse(400, `The user already has the maximum number of checks (${config.maxChecks})`)
                }
            }, () => errorResponse(403));
        }, () => errorResponse(403));

    } else {
        return errorResponse(400, 'Missing required inputs, or inputs are invalid');
    }
}

// Checks - GET
// Required data: id
// Optional data: none
handlers._checks.GET = function(data) {
    // Check that the id is valid
    var id = typeof(data.queryStringObj.id) == 'string' && data.queryStringObj.id.trim().length == TOKEN_LENGTH ? data.queryStringObj.id.trim() : false;
    if (id) {

        // Lookup the check
        return _data.read('checks', id).then(checkData => {
            // Get the token from the headers
            var token = typeof(data.headers.token) == 'string' ? data.headers.token.trim() : false;
            // Verify that the given token is valid and belongs to the user who created the check
            return handlers._tokens.verifyToken(token, checkData.userPhone)
            .then(tokenIsValid => {
                if (tokenIsValid) {
                    return validResponse(200, checkData);
                } else {
                    return errorResponse(403)
                }
            });
        }, err => {
            console.log('Error reading check', err);
            return errorResponse(403);
        });

    } else {
        return errorResponse(400, 'Missing required field');
    }
}

// Checks - PUT
// Required data: id
// Optional data: protocol, url, method, succcessCodes, timeoutSeconds (one must be sent)
handlers._checks.PUT = function(data) {
    // Check for the requried field
    var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == TOKEN_LENGTH ?
        data.payload.id.trim() : false;

    // Check for the optional fields
    var protocol = typeof(data.payload.protocol) == 'string' && ['http', 'https'].indexOf(data.payload.protocol.trim()) > -1 ? data.payload.protocol.trim() : false;
    var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length  > 0 ? data.payload.url.trim() : false;
    var method = typeof(data.payload.method) == 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(data.payload.method.trim().toUpperCase()) > -1 ? data.payload.method.trim().toUpperCase() : false;
    var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 &&  data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

    // Check to make sure id is valid
    if (id) {
        // Check to make sure one or more optional fields have been sent.
        if (protocol || url || method || successCodes || timeoutSeconds) {
            // Lookup the check
            return _data.read('checks', id).then(checkData => {
                // Get the token from the headers
                var token = typeof(data.headers.token) == 'string' ? data.headers.token.trim() : false;
                // Verify that the given token is valid and belongs to the user who created the check
                return handlers._tokens.verifyToken(token, checkData.userPhone)
                .then(tokenIsValid => {
                    if (tokenIsValid) {
                        // Update the check where necessary
                        if (protocol) {
                            checkData.protocol = protocol;
                        }
                        if (url) {
                            checkData.url = url;
                        }
                        if (method) {
                            checkData.method = method;
                        }
                        if (successCodes) {
                            checkData.successCodes = successCodes;
                        }
                        if (timeoutSeconds) {
                            checkData.timeoutSeconds = timeoutSeconds;
                        }

                        // Store the new updates
                        return _data.update('checks', id, checkData).then(
                            () => validResponse(200, checkData),
                            err => errorResponse(500, 'Could not update the check')
                        );
                    } else {
                        return errorResponse(403);
                    }
                });
            }, err => errorResponse(400, 'Check ID did not exist'));

        } else {
            return errorResponse(400, 'Missing fields to update');
        }
    } else {
        return errorResponse(400, 'Missing required field');
    }
}

// Checks - DELETE
// Required field: id
// Optional fields: none
handlers._checks.DELETE = function(data) {
    // Check that the id is valid
    var id = typeof(data.queryStringObj.id) == 'string' && data.queryStringObj.id.trim().length == TOKEN_LENGTH ?
        data.queryStringObj.id.trim() : false;
    if (id) {

        return _data.read('checks', id).then(checkData => {
            // Get the token from the headers
            var token = typeof(data.headers.token) == 'string' ? data.headers.token.trim() : false;
            // Verify that the given token is valid and belongs to the user who created the check
            return handlers._tokens.verifyToken(token, checkData.userPhone)
            .then(tokenIsValid => {
                if (tokenIsValid) {
                    // Delete the check data
                    return _data.delete('checks', id)
                    .then(() => {
                        return _data.read('users', checkData.userPhone)
                        .then(userData => {
                            var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];

                            // Remove the deleted check from their list of checks
                            var checkPosition = userChecks.indexOf(id);
                            if (checkPosition > -1) {
                                userChecks.splice(checkPosition, 1);

                                // Re-save the user's data
                                return _data.update('users', checkData.userPhone, userData)
                                .then(
                                    () => validResponse(200),
                                    () => errorResponse(500, 'Could not update the user')
                                );
                            } else return errorResponse(500, 'Could not find the check on the user\'s object so could not remove it');
                        },
                        () => errorResponse(500, 'Could not find the user who created the check, so could not remove the check from the list of check on the user object.'));
                    },
                    () => errorResponse(500, 'Could not delete the check data'));
                } else {
                    return errorResponse(403)
                }
            });
        }, () => {
            return errorResponse(400, 'The specified check ID does not exist');
        });

    } else {
        return errorResponse(400, 'Missing required field');
    }
}


// Ping handler
handlers.ping = function (data) {
    return validResponse(200);
};

// Not found handler
handlers.notFound = function (data) {
    return errorResponse(404);
};


module.exports = handlers;
