var express = require("express");
var router  = express.Router();

// root route - render home page
router.get('/', function(req, res) {
  connection.query("SELECT * FROM Course", function(error, rows, fields) {
    if (error) {
      console.log('Error in test query');
    } else {
      console.log("Successful query");
      res.render('index', {"courses": rows});
      console.log(rows);
    }
  });
});

// =================================================================================
// AUTH ROUTES
// =================================================================================

// POST login info  
router.post('/login', function(req, res) {
  // get the username and password from the request (comes from the name attr of the input)
  var user = {"username": req.body.username, "password": req.body.password};
  console.log("username:" + user.username + ", password: " + "secret");

  // render the home page and change the name to the email
  res.render('index', {email: user.username});
});

// POST sign up info
router.post('/signup', function(req, res){
  // get the username and password from the request
  var newUser = {"username": req.body.username, "password": req.body.password};

  console.log("username:" + newUser.username + ", password: " + "secret");

  //TODO check that the username is unique (i.e., not already in the database)
  res.render('index', {email: newUser.username});
});

// GET (render) signup page
router.get('/signup', function(req, res) {
  res.render('signup');
});

module.exports = router;