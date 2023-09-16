// Packages
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
const cors = require('cors');
const fs = require("fs");
const ms = require('mediaserver');

// Custom modules
const variables = require("./Variables/variables.js");
const { console_log } = require("./Modules/Logging/logging.js");
const { print_status } = require("./Modules/Logging/status.js");

//Constants
const expressPort = 5000;
const socketPort = 5001;

print_status();

// Audio mixing tool: fluent-ffmpeg
// Requires ffmpeg to be installed already, like MySQL
/*
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstance = ffmpeg();
const { Buffer } = require("node:buffer");
const { Readable } = require("stream");
*/

//Socket server configuration
const socketio = require("socket.io");
const socketServer = http.createServer(app);
const io = socketio(socketServer, { cors: { origin: variables.socketCORS } });

//Socket server functionality
io.on('connect', (socket) => {

  console_log('Connected');

  socket.emit('greet', { data: 'Greetings from socketServer' });

  var previousBuffer = [];
  var counter = 0;

  socket.on("recording", (chunk) => {

    console_log("Audio chunk recieved. Transmitting to frontend...");
    socket.broadcast.emit('listening', chunk);

    //FFMPEG Testing ------------------------------------------------
    /*
    //var dataBlob = new Blob(data, { type: 'audio/webm; codecs=opus' });
    //var file = new File([dataBlob], "blobAudioFile");
    //fs.writeFileSync("bufferversionnew.webm", Buffer.from(new Uint8Array(dataBlob)), () => console.log("Data saved"));
    //fs.writeFile("fileversion.webm", dataBlob, () => console.log("Data saved"));

    if (counter > 3) {
      console.log("Trying ffmpeg...");
      console.log("Data Chunk: ", chunk.buffer);
      console.log("Data Chunk: ", typeof (chunk.buffer));

      var stream = new Readable();
      stream._read = () => {} // _read is required but you can noop it
      stream.push(Buffer.from[1,2,3])
      stream.push(null)

      //var stream2 = new ReadableStream(previousBuffer);
      console.log("Data Stream: ", stream);

      ffmpegInstance
        .input(stream)
        .complexFilter([
          {
            filter: 'amix'
          }])
        .save('./Music/FFMPEGSTREAM.mp3');
    }

    previousBuffer = chunk;
    counter++;
    //------------------------------------------------*/
  });

  socket.on('disconnect', () => {
    console_log('Disconnected');
  });
});

//Express (API) server configuration
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

//Express "app" API
app.get('/api/', (req, res) => {
  res.send('You get: JCT Express API');
});

app.post('/api/searchSongs', async (req, res, next) => {
  const dummyResponse = [{ Title: "Concert One", ID: 1 }, { Title: "Concert Two", ID: 2 }];
  res.status(200).send({ searchResults: dummyResponse });

  /*
  var searchString = req.query["search"];
  var sqlSearch;
  if (searchString) {
    sqlSearch = "SELECT ID, Title FROM Recordings WHERE Title like '%" + searchString + "%'";
  }
  else {
    sqlSearch = "SELECT ID, Title FROM Recordings WHERE Title like '%%'";
  }

  console.log("Executing... ", sqlSearch);
  pool.execute(sqlSearch, function (err, result) {
    if (err) throw err;
    res.status(200).send({ searchResults: result });
  });
  */
});

app.get('/api/getSong', async (req, res, next) => {
  //res.status(200).send({ searchResults: "REEEE" });
  ms.pipe(req, res, './Music/' + "bass" + '.mp3');

  /*
  const songId = req.query["id"];
  let sqlSelect = "SELECT Title FROM Recordings WHERE ID=" + songId;
  var fileName = "";

  console.log("Executing... ", sqlSelect);
  pool.execute(sqlSelect, function (err, result) {
    if (err) {
      console.log("Get song failed.");
      ms.pipe(req, res, './Music/' + 'default' + '.mp3');
    }
    else if (result[0]) {
      fileName = result[0].Title;
      ms.pipe(req, res, './Music/' + fileName + '.mp3');
    }
   });
   */
});

//Servers listening
app.listen(expressPort, console_log("Express server listening on socket " + expressPort));
socketServer.listen(socketPort, console_log("Socket server listening on socket " + socketPort));

module.exports = app; //Export express object required for Jest unit testing.


//-----------------------------------------------------------------
//Local MySQL testing credentials:
/*
CREATE USER 'NewUser'@'localhost' IDENTIFIED BY '3atth!s!';
CREATE USER 'New'@'localhost' IDENTIFIED BY 'MyN3wP4ssw0rd';
*/
//-----------------------------------------------------------------
//MYSQL Integration: Not relevant for this streaming prototype
/*
const mysql = require('mysql2');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'New',
  database: 'JCT',
  password: 'MyN3wP4ssw0rd'
});
*/
//-----------------------------------------------------------------
//ms used for piping mp3s to user; not used in this current streaming prototype.
//
//-----------------------------------------------------------------
//API with MySQL proof of concept, not used for this streaming prototype.
/*
*/
//-----------------------------------------------------------------
