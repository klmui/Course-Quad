// dependencies
var express = require('express'),
    // initializes express instance from the var above
    app = express();
    
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