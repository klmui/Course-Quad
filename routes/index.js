var express = require("express");
var router  = express.Router();

// render home page
router.get('/', function(req, res) {
  res.render('index');
});

// render login page
router.get('/login', function(req, res) {
  res.render('login');
});

// render signup page
router.get('/signup', function(req, res) {
  res.render('signup');
});

module.exports = router;