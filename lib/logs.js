/*
 * Library for storing and rotating logs
 */

// Dependencies
const fsPromises = require('fs').promises;
const path = require('path');
const util = require('util');
const zlib = require('zlib');

// Container for the module
const lib = {};

// Base directory of the logs folder
lib.baseDir = path.join(__dirname, '/../.logs/');

// Append a string to a file. Create the file if it does not exist.
lib.append = function(filename, str) {
    return fsPromises.open(lib.baseDir + filename + '.log', 'a')
    .catch(err => Promise.reject('Could not open the file for appending. ' + err.message))
    .then(fileDescriptor => {
        fileDescriptor.appendFile(str + '\n')
        .catch(err => 'Error appending to file. ' + err.message)
        .then(() => fileDescriptor.close())
        .catch(err => 'Error closing file that was being appended. ' + err.message);
    });
}

// List all the logs, and optionally include the compressed logs
lib.list = function (includeCompressedLogs) {
    return new Promise(function (resolve, reject) {
        fsPromises.readdir(lib.baseDir)
        .catch(err => reject('Error reading directory. ' + err.message))
        .then(data => {
            var trimmedFileNames = [];
            trimmedFileNames = data.filter(filename => {
                return filename.indexOf('.log') > -1 || (filename.indexOf('.gz.b64') > -1 && includeCompressedLogs)
            }).map(filename => {
                // Add the .log files
                if (filename.indexOf('.log') > -1) {
                    return (filename.replace('.log', ''));
                }

                // Add on the .gz
                if (filename.indexOf('.gz.b64') > -1) {
                    return (filename.replace('.gz.b64', ''));
                }
            });
            resolve(trimmedFileNames);
        })
    });
};

// Compress the contents of one .log file into a .gz.b64 file within the same directory
lib.compress = function (logId, newFileId) {
    var sourceFile = logId + '.log';
    var destFile = newFileId + '.gz.b64';

    // Read the source file
    return new Promise(function (resolve, reject) {
        fsPromises.readFile(lib.baseDir + sourceFile, 'utf8')
        .catch(err => reject('Error reading file. ' + err.message))
        .then(inputString => {
            // Compress the data using gzip
            var gzip = util.promisify(zlib.gzip)
            return gzip(inputString)
        }).catch(err => reject('Error gzipping file. ' + err.message))
        .then(buffer => {
            // Send the data to the destination file
            return fsPromises.open(lib.baseDir + destFile, 'wx')
            .catch(err => reject('Error opening file for compressing. ' + err.message))
            .then(fileDescriptor => {
                return fileDescriptor.writeFile(buffer.toString('base64'))
                .catch(err => reject('Error writing to compressing file. ' + err.message))
                .then(() => fileDescriptor.close())
                .catch(err => reject('Error closing compressed file. ' + err.message))
            })
        }).then(() => resolve());
    });
};

// Decompress the contents of a .gz.b64 file into a string variable
lib.decompress = function (fileId) {
    var filename = fileId + '.gz.b64';
    return new Promise(function (resolve, reject) {
        fsPromises.readFile(lib.baseDir + filename, 'utf8')
        .catch(err => reject('Error reading file. ' + err.message))
        .then(str => {
            // Decompress the data
            var inputBuffer = Buffer.from(str, 'base64');
            var unzip = util.promisify(zlib.unzip);
            return unzip(inputBuffer)
            .catch(err => reject('Error unzipping file. ' + err.message))
            .then(outputBuffer => outputBuffer.toString());
        })
        .then(str => resolve(str));
    });
}

lib.truncate = function (logId) {
    return fsPromises.truncate(lib.baseDir + logId + '.log', 0)
}

// Export the module
module.exports = lib;