var express = require('express');
var router = express.Router();

// show all study groups a user is in 
router.get('/', function(req, res) {
  res.render('studyGroups/studyGroups');
});

// explore study groups
router.get('/explore', function(req, res){
  res.render('studyGroups/explore');
});

module.exports = router;