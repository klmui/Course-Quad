var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth');

// show all instructors
router.get('/', authController.isLoggedIn, function(req, res) {
  connection.query("SELECT * FROM Instructor", function(error, rows, fields) {
    if (error) {
      console.log('Error in test query');
    } else {
      res.render('instructors/instructors', {"instructors": rows, 'user': req.user});
      console.log(rows);
    }
  });
});

// show a particular instructor
router.get('/:id', authController.isLoggedIn, function(req, res) {
  res.render('instructors/instructor', {'user': req.user});
});

module.exports = router;