const fs = require("fs");
const util = require('util');
const datetime = Date.now();
const log_file = fs.createWriteStream(__dirname + '/debug' + datetime + '.log', { flags: 'w' });
const log_stdout = process.stdout;

// Console_log overload to print to file and terminal
const console_log = (...text: any[]) => {
    text.forEach((arg) => {
        log_file.write(util.format(arg) + "\n");
        log_stdout.write(util.format(arg) + "\n");
    })
}

export default console_log;