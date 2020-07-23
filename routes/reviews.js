var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth');

// show all course reviews from user
router.get('/courseReviews', authController.isLoggedIn, function(req, res) {
  res.render('reviews/courseReviews', {'user': req.user});
});

// show all instructor reviews from user
router.get('/instructorReviews', authController.isLoggedIn, function(req, res) {
  res.render('reviews/instructorReviews', {'user': req.user});
});

module.exports = router;