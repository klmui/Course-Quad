// dependencies
var express = require('express'),
    bodyParser = require("body-parser"); // needed to process POST requests

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

app.listen(process.env.PORT || 3000, function() {
  // all logs are in the terminal, not browser in node.js
  console.log('Server started!'); 
});