var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth');

// show all saved courses from a user
router.get('/', authController.isLoggedIn, function(req, res) {
  res.render('savedCourses', {'user': req.user});
});


module.exports = router;