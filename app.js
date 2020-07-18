// dependencies
require('dotenv').config();
var express    = require('express'),
    bodyParser = require("body-parser"), // needed to process POST requests
    mysql      = require('mysql');

// initializations
var app = express(); // initializes express instance from the var above
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var connection = mysql.createConnection({
  host: 'course-quad-db.czncdgwxrcel.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: process.env.DB_PASSWORD,
  database: 'CourseQuadDB'
});

// connect to DB
connection.connect(function(error) {
  if (error) {
    console.log("Could not connect to DB: " + error);
  } else {
    console.log("Connected to DB");
  }
}); 
// // Local DB Connection:
// var connection = mysql.createConnection({
//   host: '127.0.0.1', 
//   user: 'root', 
//   password: '',
//   database: 'coursequad'
// });
// connection.connect(function(error) {
//   if (error) {
//     console.log("Could not connect to DB: " + error);
//   } else {
//     console.log("Connected to DB");
//   }
// }); 
global.connection = connection;

// routes
var indexRoutes = require('./routes/index');

// app will look in public directory by default
app.use(express.static(__dirname + '/public'));

// so we don't need '.ejs' after files
app.set('view engine', 'ejs');

// Prepend '/' to all index routes
app.use('/', indexRoutes);

// TESTING route for DB
app.get('/test', function(req, res) {
  connection.query("SELECT * FROM Course", function(error, rows, fields) {
    if (error) {
      console.log('Error in test query');
    } else {
      console.log("Successful query");
      console.log(rows);
    }
  });
});

// last case: url not found
app.get('/*', function(req, res){
  res.render("404");
})

app.listen(process.env.PORT || 3000, function() {
  // all logs are in the terminal, not browser in node.js
  console.log('Server started!'); 
});