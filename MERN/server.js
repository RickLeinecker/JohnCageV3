const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ms = require('mediaserver');
const app = express();
app.use(cors());
app.use(bodyParser.json());

//Required for Jest unit testing.
module.exports = app;

const mysql = require('mysql2');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'New',
  database: 'JCT',
  password: 'MyN3wP4ssw0rd'
});

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

  pool.execute(sqlSelect, function (err, result) {
    if (err) throw err;
    if (result[0]) {
      fileName = result[0].Title;
      ms.pipe(req, res, './Music/' + fileName + '.mp3');
      //res.status(200);
    }
  });
});

//CREATE USER 'NewUser'@'localhost' IDENTIFIED BY '3atth!s!';
//CREATE USER 'New'@'localhost' IDENTIFIED BY 'MyN3wP4ssw0rd';

app.listen(5000);