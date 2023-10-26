// Debug
import console_log from "../functions/logging/console_log"

// WebSocket Server  ----------------------
import { wss, httpServer } from "./src/webSocketServer";
const webSocketPort = 8080;

httpServer.on('upgrade', function upgrade(request: any, socket: any, head: any) {
  wss.handleUpgrade(request, socket, head, function done(ws) {
    wss.emit('connection', ws, request);
  });
});

httpServer
  .listen(webSocketPort, console_log("Web socket listening on port " + webSocketPort))
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console_log("Error: address already in use");
    } else {
      console_log(err);
    }
  });
// WebSocket Server  ----------------------
