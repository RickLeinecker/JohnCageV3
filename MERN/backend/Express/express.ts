// Debug
import console_log from "../functions/logging/console_log"

// Express API server
import expressServer from "./src/expressServer";
const expressServerInstance: expressServer = new expressServer();
const expressPort = 5000;

import 'dotenv/config';

console.log(`Hello ${process.env.HELLO}`);

expressServerInstance
  .expressApp
  .listen(expressPort, () => console_log(`Express server is listening on port ${expressPort}.`))
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console_log("Error: address already in use");
    } else {
      console_log(err);
    }
  });
// Express API server  --------------------

// Export express app required for Jest unit testing.
module.exports = { expressServerInstance };