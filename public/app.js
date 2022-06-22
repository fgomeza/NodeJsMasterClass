/**
 * Frontend Logic for the application
 * 
 */

// Container for the frontend application
let app = {};

//Config
app.config = {
    'sessionToken': false
}

// Ajax Client (for the restful API)
app.client = {}

// Interface for making API calls
app.client.request = function(headers, path, method, queryStringObject, payload) {

    // Set defaults
    headers = typeof(headers) == 'object' && headers !== null ? headers : {}
    path = typeof(path) == 'string' ? path : '/'
    method = typeof(method) == 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method) > -1 ? method.toUpperCase() : 'GET'
    queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {}
    payload = typeof(payload) == 'object' && payload !== null ? payload : {}

    // For each query string parameter sent, add it to the path
    let requestUrl = path + '?';
    let counter = 0;
    for (let queryKey in queryStringObject) {
        if (queryStringObject.hasOwnProperty(queryKey)) {
            counter++;
            // If at least one query string parameter has already been added, prepend new ones with an ampersand
            if (counter > 1) {
                requestUrl += '&'
            }

            // Add the key and value
            requestUrl += queryKey + '=' + queryStringObject[queryKey];
        }
    }

    // Form the http reuqest as a JSON type
    let xhr = new XMLHttpRequest();
    xhr.open(method, requestUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // For each header sent, add it to the request
    for (let headerKey in headers) {
        if (headers.hasOwnProperty(headerKey)) {
            xhr.setRequestHeader(headerKey, headers[headerKey]);
        }
    }

    // If there is a current session token set, add that as a header
    if (app.config.sessionToken) {
        xhr.setRequestHeader('token', app.config.sessionToken.id);
    }

    // When the request comes back, handle the response
    let promise = new Promise(function (resolve, reject) {
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                let statusCode = xhr.status;
                let responseReturned = xhr.responseText;

                try {
                    let parsedResponse = JSON.parse(responseReturned);
                    resolve([statusCode, parsedResponse])
                } catch (e) {
                    resolve([statusCode])
                }
            }
        }
    });

    // Send the payload as JSON
    let payloadString = JSON.stringify(payload);
    xhr.send(payloadString);

    return promise;
}