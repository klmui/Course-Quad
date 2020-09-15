var express = require('express');
var router = express.Router();
var authController = require('../controller/auth');

// show all course reviews from user
router.get('/courseReviews', authController.isLoggedIn, function(req, res) {
  var query = `
    SELECT cr.course_id, cr.stars, cr.difficulty, cr.username, date(cr.date) as date, cr.year, c.name, cr.comment
    FROM CourseRating cr
    JOIN Course c on c.courseID=cr.course_id
    WHERE cr.username='${req.user.username}';
  `;
  connection.query(query, function(error, rows, fields) {
    if (error) {
      console.log("error in query");
    } else {
      res.render('reviews/courseReviews', {'user': req.user, "courseReviews": rows});
    }
  });
});

// show all instructor reviews from user
router.get('/instructorReviews', authController.isLoggedIn, function(req, res) {
  var query = `
    SELECT i.instructorID, ir.stars, ir.username, date(ir.date) as date, i.name, ir.comment
    FROM InstructorRating ir
    JOIN Instructor i on i.instructorID=ir.instructor_id
    WHERE ir.username='${req.user.username}';
  `;
  connection.query(query, function(error, rows, fields) {
    if (error) {
      console.log("error in query");
    } else {
      res.render('reviews/instructorReviews', {'user': req.user, "instructorReviews": rows});
    }
  });
});

module.exports = router;