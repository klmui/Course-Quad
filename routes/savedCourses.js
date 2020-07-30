var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth');

// show all saved courses from a user
router.get('/', authController.isLoggedIn, function(req, res) {
  var query = `
    SELECT DISTINCT * FROM savedCourses sc
    JOIN Course c on sc.course_id=c.courseID
    WHERE username='${req.user.username}';
  `;
  connection.query(query, function(error, rows, fields) {
    if (error) {
      console.log(error);
      console.log("error in query");
    } else {
      res.render('savedCourses', {'user': req.user, 'savedCourses': rows});
    }
  });
});


module.exports = router;