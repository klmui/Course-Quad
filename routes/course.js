var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth');

// show a particular course
router.get("/:courseID", authController.isLoggedIn, (req, res) => {
  var courseID = req.params.courseID;
  var query = 
  `
    select c.courseID, c.number as number, c.name as course_name, subj.abbreviation as subject, 
    avg(r.difficulty) as avgDifficulty, avg(r.stars) as avgRating, term.semester, term.year, i.name as instructor, i.instructorID as instructor_id,
    d.num_a as numA, 
    d.num_ab as numAB, d.num_b as numB,
    d.num_bc as numBC, d.num_c as numC, d.num_d as numD, 
    d.num_f as numF
    from Course c
    inner join Offering o 
    on c.courseID = o.course_id
    inner join Belongs b
    on o.ID = b.course_offering_id
    inner join Subject subj
    on subj.code = b.subject_code 
    inner join Term term 
    on term.code = o.term_code
    inner join SectionToDistributionMapping m
    on o.ID = m.course_offering_id
    inner join Distribution d 
    on m.distribution_id = d.ID
    inner join Section s 
    on s.distribution_id = m.distribution_id
    inner join Teach t
    on s.ID = t.section_id
    inner join Instructor i
    on t.instructor_id = i.instructorID
    left join CourseRating r
    on c.courseID = r.course_id
    where subj.code is NOT NULL and c.courseID="${courseID}"
    and s.distribution_id > 0
    GROUP BY c.name, term.semester, term.year, i.instructorID
    ORDER BY term.year DESC;
  `;

  connection.query(query, function(error, rows, fields) {
    if (error) {
      console.log("Error in query");
    } else {
      var query2 = `
          select avg(r.stars) as avgRating, date(r.date) as date
          from Course c
          inner join Offering o
          on c.courseID = o.course_id
          inner join Belongs b
          on o.ID = b.course_offering_id
          inner join Subject subj
          on subj.code = b.subject_code
          inner join Term term
          on term.code = o.term_code
          inner join SectionToDistributionMapping m
          on o.ID = m.course_offering_id
          inner join Distribution d
          on m.distribution_id = d.ID
          inner join Section s
          on s.distribution_id = m.distribution_id
          inner join Teach t
          on s.ID = t.section_id
          inner join Instructor i
          on t.instructor_id = i.instructorID
          left join CourseRating r
          on c.courseID = r.course_id
        where  subj.code is NOT NULL and c.courseID='${courseID}'
        and s.distribution_id > 0
        group by date(r.date) # -1 if null
        order by date(r.date);
      `;
      connection.query(query2, function(error, rows2, fields) {
        if (error) {
          console.log("error in query");
        } else {
          var query3 = `
          SELECT comment, stars, difficulty, username, date(date) as date, year, id 
          FROM CourseRating 
          WHERE course_id='${courseID}'
          order by date(date) DESC;
          ;
          `;
          connection.query(query3, function(error, rows3, fields) {
            if (error) {
              console.log("error in query");
            } else {
              console.log(rows3);
              res.render('course', {'courseInfo': rows, 'user': req.user, 'courseRating': rows2, "courseReviews": rows3});
            }
          });
        }
      });
    }
  });
});

router.post('/:id/comment', function(req, res) {
  var query = `
    INSERT INTO CourseRating(comment, stars, course_id, difficulty, username, date) VALUES ?
  `;
  var values = [
    [req.body.comment, req.body.stars, req.body.course_id, req.body.difficulty, req.body.username, req.body.date]
  ];

  connection.query(query, [values], function(err, result) {
    if (err) {
      console.log(err);
      console.log("error in query");
    } else {
      res.send(result.insertId.toString());
    }
  });
});

router.delete('/:id/comment', function(req, res) {
  var query = `
    DELETE FROM CourseRating WHERE id = ?
  `;
  connection.query(query, req.body.id, function(error, results, fields) {
    if (error) {
      console.log("error in query");
      console.log(error);
    } else {
      res.send("success");
    }
  });
});

router.put('/:id/comment', function(req, res) {
  var query = `
    UPDATE CourseRating SET stars =?, difficulty = ?, comment = ?
    WHERE id = ?
  `;
  var values = [req.body.stars, req.body.difficulty, req.body.comment, req.body.id];

  connection.query(query, values, (error, results, fields) => {
    if (error) {
      console.log("error in query");
      console.log(error);
    } else {
      res.send("success");
    }
  });
});

module.exports = router;