var express = require("express");
var router  = express.Router();

// root route - render home page
router.get('/', function(req, res) {
  // try {
  //   connection.query("SELECT * FROM Course", function(error, rows, fields) {
  //     if (error) {
  //       console.log('Error in test query');
  //     } else {
  //       // set data to redis (cache)
  //       // can set an expiration because data on server can change
  //       client.setex("courses", 3600, JSON.stringify(rows));

  //       res.render('index', {"courses": rows});
  //       console.log(rows);
  //     }
  //   });
  // } catch (err) {
  //   console.log(err);
  //   res.status(500); // server error
  // }
  connection.query("SELECT * FROM Course", function(error, rows, fields) {
    if (error) {
      console.log('Error in test query');
    } else {
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
  connection.query("SELECT * FROM Course", function(error, rows, fields) {
    if (error) {
      console.log('Error in test query');
    } else {
      var user = {"username": req.body.username, "password": req.body.password};
      console.log("username:" + user.username + ", password: " + "secret");
    
      // render the home page and change the name to the email
      res.render('index', {email: user.username, 'courses': rows});
    }
  });
});

// POST sign up info
router.post('/signup', function(req, res){
  connection.query("SELECT * FROM Course", function(error, rows, fields) {
    if (error) {
      console.log('Error in test query');
    } else {
       // get the username and password from the request
      var newUser = {"username": req.body.username, "password": req.body.password};

      console.log("username:" + newUser.username + ", password: " + "secret");

      res.render('index', {email: newUser.username, 'courses': rows});

      //TODO check that the username is unique (i.e., not already in the database)
    }
  });
});

module.exports = router;