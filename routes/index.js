var express = require("express");
var router  = express.Router();
var authController = require('../controllers/auth');

// root route - render home page
router.get('/', authController.isLoggedIn, function(req, res) {
  var query = `
    select s.abbreviation as subject, c.number as course_number, c.name as course_name, avg(r.difficulty) as avgDifficulty, c.courseID,
    avg(r.stars) as avgRating,
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
      console.log('Error in query');
    } else {
      res.render('index', {"courses": rows, "user": req.user});
      //console.log(rows);
    }
  });
});

// load profile page
router.get('/profile', authController.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render('profile', {"user": req.user});
  } else {
    res.redirect('/');
  }
});

// =================================================================================
// AUTH ROUTES
// =================================================================================

// POST login info  
router.post('/login', function(req, res) {
  var query = `
  select s.abbreviation as subject, c.number as course_number, c.name as course_name, avg(r.difficulty) as avgDifficulty, c.courseID,
  avg(r.stars) as avgRating,
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
  connection.query(query, async function(error, rows, fields) {
    if (error) {
      console.log('Error in query');
    } else {
      var user = {"username": req.body.username, "password": req.body.password};

      if (!user.username || !user.password) {
        // bad request
        return res.status(400).render('index', {
          message: 'Please provide a username and password.'
        });
      }

      var query = `
        SELECT * 
        FROM User
        WHERE username = ?;
      `;
      var values = [
        [user.username]
      ];
      connection.query(query, [values], async (err, results) => {
        console.log(results);
        if (!results || (!await bcrypt.compare(user.password, results[0].password))) {
          // 401 is forbidden
          res.status(401).render('index', {
            message: 'Username or password is incorrect.',
            'courses': rows
          });
        } else {
          const username = results[0].username;

          var userReturned = {'username': username};

          // create token
          const token = jwt.sign({ username: username }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES_IN
          });

          // create cookie
          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
          }
          
          // can specify any name for cookie - insert cookie
          res.cookie('jwt', token, cookieOptions);

          console.log(token);
          // render the home page and change the name to the email
          res.render('index', {"user": userReturned, 'courses': rows});
        } 
      });
    }
  });
});

// logout - runs function from controller
router.get('/logout', authController.logout);

// POST sign up info
router.post('/signup', function(req, res){
  var query = `
    select s.abbreviation as subject, c.number as course_number, c.name as course_name, avg(r.difficulty) as avgDifficulty, c.courseID,
    avg(r.stars) as avgRating,
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
      console.log('Error in query');
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
          res.status(401).render('index', {
            'message': 'Error signing up. Username is already taken.',
            'courses': rows
          });
        } else {
          console.log(results);

          // create token and insert cookie
          const token = jwt.sign({ username: newUser.username }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES_IN
          });

          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
          }
          
          // can specify any name for cookie
          // need to decode the token to get username
          res.cookie('jwt', token, cookieOptions);

          console.log(token);
          // render the home page and change the name to the email
          var userReturned = {'username': newUser.username};
          res.render('index', {user: userReturned, 'courses': rows});
        }
      });
    }
  });
});

module.exports = router;