var express = require('express');
var router = express.Router();

// show all course reviews from user
router.get('/courseReviews', function(req, res) {
  res.render('reviews/courseReviews');
});

// show all instructor reviews from user
router.get('/instructorReviews', function(req, res) {
  res.render('reviews/instructorReviews');
});

module.exports = router;