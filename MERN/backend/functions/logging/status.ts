// This file is mostly useless atm since being transferred from JS backend.
const { console_log } = require("./logging");
const variables = require("../../Variables/variables");

// Print server status
const print_status = () => {
    console_log("NODE_ENV: " + process.env.NODE_ENV);
    console_log("socketCORS: " + variables.socketCORS);
    return;
}

export default print_status;