/**
 * Example VM
 * Running some arbitrary commands
 */

// Dependencies
const vm = require('vm');

let context = {
    'foo': 25
}

let script = new vm.Script(`
    foo = foo * 2;
    var bar = foo + 1;
    var fizz = 52;
`)

// Run the script
script.runInNewContext(context);
console.log(context);