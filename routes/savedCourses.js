var express = require('express');
var router = express.Router();

// show all saved courses from a user
router.get('/', function(req, res) {
  res.render('savedCourses');
});


module.exports = router;