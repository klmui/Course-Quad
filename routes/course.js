var express = require('express');
var router = express.Router();

// show a particular course
router.get('/:id', function(req, res) {
  res.render('course');
});

module.exports = router;