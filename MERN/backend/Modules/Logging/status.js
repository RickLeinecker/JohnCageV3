const { console_log } = require("./logging.js");
const variables = require("../../Variables/variables.js");

// Print server status
const print_status = () => {
    console_log("NODE_ENV: " + process.env.NODE_ENV);
    console_log("socketCORS: " + variables.socketCORS);
    return;
}

module.exports = { print_status }