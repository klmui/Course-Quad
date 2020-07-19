var express = require('express');
var router = express.Router();

// show all instructors
router.get('/', function(req, res) {
  res.render('instructors/instructors');
});

// show a particular instructor
router.get('/:id', function(req, res) {
  res.render('instructors/instructor');
});

module.exports = router;