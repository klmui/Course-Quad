// dependencies
require('dotenv').config();
var express    = require('express'),
    bodyParser = require("body-parser"), // needed to process POST requests
    mysql      = require('mysql');

// initializations
// initializes express instance from the var above
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
  connection.query("SELECT * FROM mySampleTable", function(error, rows, fields) {
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