const fs = require("fs");
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', { flags: 'w' });
var log_stdout = process.stdout;

// Console_log overload to print to file and terminal
const console_log = (text: any) => {
    log_file.write(util.format(text) + '\n');
    log_stdout.write(util.format(text) + '\n');
}

export default console_log;

/* Prints the contents of curent directory in windows. For linux change dir to ls.
const { exec } = require("child_process");

    exec("dir", (error: any, stdout: any, stderr: any) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
  });

  */