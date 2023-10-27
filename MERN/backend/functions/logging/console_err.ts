const fs = require("fs");
var util = require('util');
var err_file = fs.createWriteStream(__dirname + '/error.log', { flags: 'w' });
var log_stderr = process.stderr;

// Console_err to print to file and terminal
const console_err = (...text: any[]) => {
    text.forEach((arg) => {
        err_file.write(util.format(arg) + '\n');
        log_stderr.write(util.format(arg) + '\n');
    })
}

export default console_err;