const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
const cors = require('cors');
const expressPort = 5000;
const socketPort = 5001;

//Export express object required for Jest unit testing.
module.exports = app;

//Socket server configuration
const socketio = require("socket.io");
const socketServer = http.createServer(app);
const io = socketio(socketServer, { cors: { origin: "http://localhost:3000" } });

//Socket server functionality
io.on('connect', (socket) => {
  console.log('A user connected');

  socket.emit('receiveGreet', { data: 'This message from socketServer' }, (error) => {
    console.log('error: ', error)
  })

  socket.on("recording", (data) => {
    console.log("Audio data recieved. Transmitting to frontend...")
    socket.broadcast.emit('listening', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
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
app.get('/', (req, res) => {
  res.send('Hello World');
});

//Servers listening
app.listen(expressPort, console.log("Express server listening on socket " + expressPort));
socketServer.listen(socketPort, console.log("Socket server listening on socket " + socketPort));




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
//const ms = require('mediaserver');

//-----------------------------------------------------------------

//API with MySQL proof of concept, not used for this streaming prototype.
/*
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

app.post('/api/searchSongs', async (req, res, next) => {
 var searchString = req.query["search"];
 var sqlSearch;
 if (searchString) {
   sqlSearch = "SELECT ID, Title FROM Recordings WHERE Title like '%" + searchString + "%'";
 }
 else {
   sqlSearch = "SELECT ID, Title FROM Recordings WHERE Title like '%%'";
 }

 pool.execute(sqlSearch, function (err, result) {
   if (err) throw err;
   res.status(200).send({ searchResults: result });
 });
});

app.get('/api/getSong', async (req, res, next) => {
 const songId = req.query["id"];
 let sqlSelect = "SELECT Title FROM Recordings WHERE ID=" + songId;
 var fileName = "";
 console.log(sqlSelect);
});
*/

//-----------------------------------------------------------------
