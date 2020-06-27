var express = require("express");
var router  = express.Router();

// root route - render home page
router.get('/', function(req, res) {
  res.render('index');
});

// ===========
// AUTH ROUTES
// ===========

// POST login info  
router.post('/login', function(req, res) {
  // get the username and password from the request (comes from the name attr of the input)
  var user = {"username": req.body.username, "password": req.body.password};
  console.log("username:" + user.username + ", password: " + "secret");

  // render the home page and change the name to the email
  res.render('index', {email: user.username});
});

// GET (render) signup page
router.get('/signup', function(req, res) {
  res.render('signup');
});

module.exports = router;