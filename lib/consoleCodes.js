let codes = {};

codes.black = '\x1b[30m%s\x1b[0m';
codes.red = '\x1b[31m%s\x1b[0m';
codes.green = '\x1b[32m%s\x1b[0m';
codes.yellow = '\x1b[33m%s\x1b[0m';
codes.blue = '\x1b[34m%s\x1b[0m';
codes.magenta = '\x1b[35m%s\x1b[0m';
codes.cyan = '\x1b[36m%s\x1b[0m';
codes.white = '\x1b[37m%s\x1b[0m';
codes.reset = '\x1b[0m%s';

module.exports = codes;