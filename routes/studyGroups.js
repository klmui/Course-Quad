var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth');

// show all study groups a user is in 
router.get('/', authController.isLoggedIn, function(req, res) {
  res.render('studyGroups/studyGroups', {'user': req.user});
});

// explore study groups
router.get('/explore', authController.isLoggedIn, function(req, res) {
  var query = `
    SELECT * FROM StudyGroup;
  `;
  connection.query(query, function(error, rows, fields) {
    if (error) {
      console.log("error in query");
    } else {
      var query2 = `
        SELECT s.ID, u.email, u.username, m.sort_order FROM StudyGroup s
        JOIN Membership m on s.ID=m.study_group_id
        JOIN User u on m.username=u.username
        ORDER BY s.ID, m.sort_order;
      `;
      connection.query(query2, function(error, rows2, fields) {
        if (error) {
          console.log("error in query");
        } else {
          res.render('studyGroups/explore', {'user': req.user, 'studyGroups': rows, 'users': rows2});
        }
      });
    }
  });
});

module.exports = router;