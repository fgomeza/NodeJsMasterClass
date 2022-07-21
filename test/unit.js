/**
 * The unit tests
 */

// Dependencies
const helpers = require('./../lib/helpers');
const assert = require('assert');
const logs = require('./../lib/logs');
const exampleDebuggingProblem = require('./../lib/exampleDebuggingProblem');
const example = require('./../lib/exampleDebuggingProblem');

// Holder for tests
let unit = {};

// Assert that the getANumber function is returning a number
unit['helpers.getANumber should return a number'] = function (done) {
    let val = helpers.getANumber();
    assert.equal(typeof(val), 'number');
    done();
};

// Assert that the getANumber function is returning a 1
unit['helpers.getANumber should return 1'] = function (done) {
    let val = helpers.getANumber();
    assert.equal(val, 1);
    done();
};

// Assert that the getANumber function is returning a 2
unit['helpers.getANumber should return 2'] = function (done) {
    let val = helpers.getANumber();
    assert.equal(val, 2);
    done();
};

// Logs.list should 
unit['logs.list should callback a false error and an array of log names'] = function(done) {
    logs.list(true).then(logFileNames => {
        assert.ok(logFileNames instanceof Array);
        assert.ok(logFileNames.length > 1);
        done();
    })
};

// Logs.truncate should not throw if the logId doesn't exist
unit['logs.truncate should not throw if the logId oes not exist'] = function (done) {
    assert.doesNotThrow(function() {
        logs.truncate('I do not exist').catch(err => {
            assert.ok(err);
            done();
        })
    }, TypeError)
}

unit['ExampleDebuggingProblem.init should not throw when called'] = function (done) {
    assert.doesNotThrow(function() {
        example.init();
        done();
    }, TypeError)
}

module.exports = unit;