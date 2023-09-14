const fs = require("fs");
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', { flags: 'w' });
var log_stdout = process.stdout;

// Console.log overload to print to file and terminal
const console_log = (text) => {
    log_file.write(util.format(text) + '\n');
    log_stdout.write(util.format(text) + '\n');
}

module.exports = { console_log };