var express = require('express');
var router = express.Router();

// show all instructors
router.get('/', function(req, res) {
  connection.query("SELECT * FROM Instructor", function(error, rows, fields) {
    if (error) {
      console.log('Error in test query');
    } else {
      res.render('instructors/instructors', {"instructors": rows});
      console.log(rows);
    }
  });
});

// show a particular instructor
router.get('/:id', function(req, res) {
  res.render('instructors/instructor');
});

module.exports = router;