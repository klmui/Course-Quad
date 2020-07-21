var express = require("express");
var router  = express.Router();

// root route - render home page
router.get('/', function(req, res) {
  // try {
  //   connection.query("SELECT * FROM Course", function(error, rows, fields) {
  //     if (error) {
  //       console.log('Error in test query');
  //     } else {
  //       // set data to redis (cache)
  //       // can set an expiration because data on server can change
  //       client.setex("courses", 3600, JSON.stringify(rows));

  //       res.render('index', {"courses": rows});
  //       console.log(rows);
  //     }
  //   });
  // } catch (err) {
  //   console.log(err);
  //   res.status(500); // server error
  // }
  var query = `
    select s.abbreviation as subject, c.number as course_number, c.name as course_name, r.difficulty, c.courseID,
    r.stars,
    count(*) as numOfGradeDistributions, sum(d.num_a) as total_numA,
    sum(d.num_ab) as total_numAB, sum(d.num_b) as total_numB,
    sum(d.num_bc) as total_numBC, sum(d.num_c) as total_numC, sum(d.num_d) as total_numD,
    sum(d.num_f) as total_numF
    from Course c #, Distribution d, Offering o, SectionToDistributionMapping m, Subject s, Belongs b
    inner join Offering o on
    o.course_id = c.courseID
    inner join SectionToDistributionMapping m on
    m.course_offering_id = o.ID
    inner join Distribution d on
    d.ID = m.distribution_id
    inner join Belongs b on
    b.course_offering_id = o.ID
    inner join Subject s on
    s.code = b.subject_code
    left Join CourseRating r
    on c.courseID = r.course_id
    group by c.courseID;
  `;
  connection.query(query, function(error, rows, fields) {
    if (error) {
      console.log('Error in test query');
    } else {
      res.render('index', {"courses": rows});
      console.log(rows);
    }
  });
});

// =================================================================================
// AUTH ROUTES
// =================================================================================

// POST login info  
router.post('/login', function(req, res) {
  var query = `
  select s.abbreviation as subject, c.number as course_number, c.name as course_name, r.difficulty, c.courseID,
    r.stars,
    count(*) as numOfGradeDistributions, sum(d.num_a) as total_numA,
    sum(d.num_ab) as total_numAB, sum(d.num_b) as total_numB,
    sum(d.num_bc) as total_numBC, sum(d.num_c) as total_numC, sum(d.num_d) as total_numD,
    sum(d.num_f) as total_numF
    from Course c #, Distribution d, Offering o, SectionToDistributionMapping m, Subject s, Belongs b
    inner join Offering o on
    o.course_id = c.courseID
    inner join SectionToDistributionMapping m on
    m.course_offering_id = o.ID
    inner join Distribution d on
    d.ID = m.distribution_id
    inner join Belongs b on
    b.course_offering_id = o.ID
    inner join Subject s on
    s.code = b.subject_code
    left Join CourseRating r
    on c.courseID = r.course_id
    group by c.courseID;
  `;
  // get the username and password from the request (comes from the name attr of the input)
  connection.query(query, function(error, rows, fields) {
    if (error) {
      console.log('Error in test query');
    } else {
      var user = {"username": req.body.username, "password": req.body.password};
      console.log("username:" + user.username + ", password: " + "secret");
    
      // render the home page and change the name to the email
      res.render('index', {email: user.username, 'courses': rows});
    }
  });
});

// POST sign up info
router.post('/signup', function(req, res){
  var query = `
    select s.abbreviation as subject, c.number as course_number, c.name as course_name, r.difficulty, c.courseID,
    r.stars,
    count(*) as numOfGradeDistributions, sum(d.num_a) as total_numA,
    sum(d.num_ab) as total_numAB, sum(d.num_b) as total_numB,
    sum(d.num_bc) as total_numBC, sum(d.num_c) as total_numC, sum(d.num_d) as total_numD,
    sum(d.num_f) as total_numF
    from Course c #, Distribution d, Offering o, SectionToDistributionMapping m, Subject s, Belongs b
    inner join Offering o on
    o.course_id = c.courseID
    inner join SectionToDistributionMapping m on
    m.course_offering_id = o.ID
    inner join Distribution d on
    d.ID = m.distribution_id
    inner join Belongs b on
    b.course_offering_id = o.ID
    inner join Subject s on
    s.code = b.subject_code
    left Join CourseRating r
    on c.courseID = r.course_id
    group by c.courseID;
  `;
  connection.query(query, async function(error, rows, fields) {
    if (error) {
      console.log('Error in test query');
    } else {
       // get the username and password from the request
      var newUser = {"username": req.body.username, "password": req.body.password, "email": req.body.email};

      console.log("username:" + newUser.username + ", password: " + "secret");
      var query = "INSERT INTO User (username, password, email) VALUES ?";

      // hash password - takes awhile so we need aysnc await
      let hashedPassword = await bcrypt.hash(newUser.password, 8);

      var values = [
        [newUser.username, hashedPassword, newUser.email]
      ];
      
      // insert user into DB
      connection.query(query, [values], function(err, results) {
        if (err) {
          console.log(err);
          console.log("Error signing up. Duplicate username.");
        } else {
          console.log(results);
          res.render('index', {name: newUser.username, 'courses': rows});
        }
      });
    }
  });
});

module.exports = router;