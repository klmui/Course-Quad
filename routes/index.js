var express = require("express");
var bodyParser = require("body-parser"); // needed to process POST requests
var router  = express.Router();

// render home page
router.get('/', function(req, res) {
  res.render('index');
});

// accept the POST request from the login modal
router.post('/login', function(req, res) {
  console.log("POST request received!");
});

// render signup page
router.get('/signup', function(req, res) {
  res.render('signup');
});

module.exports = router;