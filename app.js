var express = require('express'),
    // initializes express instance from the var above
    app = express(); 

app.get('/', function(req, res) {
  res.render('index.ejs');
});

// app will look in public directory by default
app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 3000, function() {
  // all logs are in the terminal, not browser in node.js
  console.log('Server started!'); 
});