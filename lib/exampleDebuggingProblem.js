/**
 * Library that demonstrates something throwing when it's init() is called
 */

// Container for the module
let example = {}

example.init = function() {
    // This is an error created intentionally (bar is not defined)
    let foo = bar;
}

module.exports = example;