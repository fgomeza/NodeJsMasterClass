/*
 * Library for storing and editing data
 */

// Dependencies
// const util = require('util');
const fsPromises = require('fs').promises;
const path = require('path');
const helpers = require('./helpers');

// Container for the module(to be exported)
const lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');
console.log(`baseDir is ${__dirname} ${lib.baseDir}`);

// Write data to a file
lib.create = function (dir, filename, data) {
    // Open the file for writing
    return fsPromises.open(path.join(lib.baseDir + dir, `${filename}.json`), 'wx')
    .catch((err) => Promise.reject('Could not create new file, it may already exist. ' + err.message))
    .then(fileDescriptor => {
        // Convert data to string
        var stringData = JSON.stringify(data);

        // Write to file and close it
        return fileDescriptor.writeFile(stringData)
            .catch(err => Promise.reject('Error writing to new file.' + err.message))
            .then(() => fileDescriptor.close())
            .catch(err => Promise.reject('Error closing new file. ' + err.message));
    });
}

// Read data from a file
lib.read = function (dir, filename) {
    return fsPromises.readFile(path.join(lib.baseDir + dir, `${filename}.json`), 'utf-8')
    .then(data => {
        if (data) {
            return helpers.parseJsonToObject(data);
        } else {
            return Promise.reject('No data to parse. ' + data);
        }
    });
}

// Update data inside a file
lib.update = function (dir, filename, data) {
    return fsPromises.open(path.join(lib.baseDir + dir, `${filename}.json`), 'r+')
    .catch(err => Promise.reject('Could not open the file for updating, it may not yet exist. ' + err.message))
    .then(fileDescriptor => {
        var stringData = JSON.stringify(data);

        return fileDescriptor.truncate()
            .catch(err => 'Error truncating file. ' + err.message)
            .then(() => fileDescriptor.writeFile(stringData))
            .catch(err => 'Error writing to existing file. ' + err.message)
            .then(() => fileDescriptor.close())
            .catch(err => 'Error closing the file. ' + err.message);
    });
}

// Delete a file
lib.delete = function (dir, filename) {
    // Unlink the file
    return fsPromises.unlink(path.join(lib.baseDir + dir, `${filename}.json`));
}

// List all the items in a directory
lib.list = function (dir) {
    return fsPromises.readdir(lib.baseDir + dir + '/')
        .then(data => data.map(filename => filename.replace('.json', '')));

    // var readdir = util.promisify(fs.readdir);
    // return util.promisify(fs.readdir(lib.baseDir + dir + '/'))
    //     .then(data => data.map(filename => filename.replace('.json', '')));
}

// Export the module
module.exports = lib;