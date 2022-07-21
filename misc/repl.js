/**
 * Example REPL Server
 * Take in the word "fizz" and log out "buzz"
 */

const repl = require('repl');

// Start the REPL
repl.start({
    'prompt': '>',
    'eval': function(str) {
        // Evalutation function for incoming inputs
        console.log("At the evaluation stage: ", str);

        // If the user said "fizz" say "buzz" back to them
        if (str.indexOf('fizz') > -1) {
            console.log('buzz');
        }
    }
});