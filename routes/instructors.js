var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth');

// show all instructors
router.get('/', authController.isLoggedIn, function(req, res) {
  var query = `
    select i.instructorID as instructorID,
    i.name as instructor, avg(r.stars) as avgRating,
    avg(r.difficulty) as avg_difficulty
    from Instructor i
    left join InstructorRating r
    on i.instructorID = r.instructor_id
    group by i.instructorID
    order by i.name;
  `;
  connection.query(query, function(error, rows, fields) {
    if (error) {
      console.log('Error in query');
    } else {
      res.render('instructors/instructors', {"instructors": rows, 'user': req.user});
      console.log(rows);
    }
  });
});

// show a particular instructor
router.get('/:id', authController.isLoggedIn, function(req, res) {
  var query1 = `
  select c.courseID, i.instructorID as instructorID, i.name as instructor, subj.abbreviation as subjectAbbr, c.number as course_number, c.name as course_name, avg(r.stars) as avgRating,
  avg(r.difficulty) as avg_course_difficulty
  from Course c
  inner join Offering o on
  o.course_id = c.courseID
  inner join Belongs b
  on b.course_offering_id = o.ID
  inner join Subject subj
  on subj.code = b.subject_code
  inner join SectionToDistributionMapping m on
  m.course_offering_id = o.ID
  inner join Distribution d on
  d.ID = m.distribution_id
  inner join Section s on
  s.Distribution_ID = d.ID
  inner join Teach t on
  s.ID = t.section_id
  inner join Instructor i on
  i.instructorID = t.instructor_id
  left join CourseRating r
  on c.courseID = r.course_id
  where t.instructor_id = i.instructorID and i.instructorID=${req.params.id}
  and subj.code is NOT NULL
  group by c.courseID, subj.code, i.name;
  `;
  connection.query(query1, function(error, rows, fields) {
    if (error) {
      console.log("error in query");
    } else {
      var query2 = `
        select i.instructorID as instructorID, i.name as instructor, date(r.date) as date,
        avg(r.stars) as avgRating, avg(r.difficulty) as avg_difficulty, count(*) as num_instructor_reviews
        from Instructor i
        left join InstructorRating r
        on i.instructorID = r.instructor_id
        where i.instructorID=${req.params.id}
        group by i.instructorID, date(r.date)
        order by i.instructorID, r.date ASC;
      `;
      connection.query(query2, function(error, rows2, fields) {
        if (error) {
          console.log('Error in query');
        } else {
          var query3 = `
            select i.instructorID as instructorID, i.name as instructor, r.date as date,
            r.stars as rating, r.difficulty as difficulty, r.review as review, r.comment, r.username
            from Instructor i
            left join InstructorRating r
            on i.instructorID = r.instructor_id
            WHERE r.comment is not null and i.instructorID=${req.params.id}
            order by r.date;
          `;
          connection.query(query3, function(error, rows3, fields) {
            if (error) {
              console.log('Error in query');
            } else {
              console.log(rows3);
              res.render('instructors/instructor', {'user': req.user, 'coursesByInstructor': rows, 'ratingOverTime': rows2, 'reviews': rows3});
            }
          });          
        }
      });
    }
  });
});
module.exports = router;