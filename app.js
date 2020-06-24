// dependencies
var express    = require('express'),
    bodyParser = require("body-parser"), // needed to process POST requests
    mysql      = require('mysql');

// initializations
// initializes express instance from the var above
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connect to DB
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'courseQuad'
});
connection.connect(function(error) {
  if (error) {
    console.log("Could not connect to DB: " + error);
  } else {
    console.log("Connected to DB");
  }
}); 
    
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

app.listen(process.env.PORT || 3000, function() {
  // all logs are in the terminal, not browser in node.js
  console.log('Server started!'); 
});