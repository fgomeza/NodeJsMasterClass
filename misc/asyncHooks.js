/**
 * Async Hooks Example
 */

// Dependencies
const async_hooks = require('async_hooks');
const fs = require('fs');

let targetExecutionContext = false;

let whatTimeIsIt = function(callback) {
    setInterval(function() {
        fs.writeSync(1, 'When the setIntervalruns, the executioncontext is '+async_hooks.executionAsyncId()+'\n');
        callback(Date.now());
    }, 1000);
};

whatTimeIsIt(function(time) {
    fs.writeSync(1, 'The time is '+time+'\n')
});

let hooks = {
    init(asyncId, type, triggerAsyncId, resource) {
        fs.writeSync(1, 'Hook init '+asyncId+'\n');
    },
    before(asyncId) {
        fs.writeSync(1, 'Hook before '+asyncId+'\n');
    },
    after(asyncId) {
        fs.writeSync(1, 'Hook after '+asyncId+'\n');
    },
    destroy(asyncId) {
        fs.writeSync(1, 'Hook destroy '+asyncId+'\n');
    },
    promiseResolve(asyncId) {
        fs.writeSync(1, 'Hook promiseResolve '+asyncId+'\n');
    },
}

let asyncHook = async_hooks.createHook(hooks);
asyncHook.enable();