var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth');

// show all study groups a user is in 
router.get('/', authController.isLoggedIn, function(req, res) {
  res.render('studyGroups/studyGroups', {'user': req.user});
});

// explore study groups
router.get('/explore', authController.isLoggedIn, function(req, res){
  res.render('studyGroups/explore', {'user': req.user});
});

module.exports = router;