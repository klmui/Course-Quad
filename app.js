var express = require('express'),
app = express();

app.get('/', function(req, res) {
  res.render('index.ejs');
});

app.listen(process.env.PORT || 3000, function() {
  console.log('Server started!');
});