
/*npm install --save express npm install mongodb@4.13.0 npm install --save kill-port npm install --save pug npm install multer npm install --save cookie-parser  npm install mongoose@6.8 npm install --save express-session npm install connect-mongodb-session --save*/
/* copy all the first line to install all the needed libraries*/
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

// CORS Headers => Required for cross-origin/ cross-server communication
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS,PUT'
  );
  next();
});


// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array());


var reports = require('./routes/reports');

app.use('/reports', reports);


app.listen(8000);