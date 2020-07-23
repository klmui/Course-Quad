/* middleware file for auth, could also put the auth functions (signin + register) in here */

var express = require('express');
var router = express.Router();
var { promisify } = require('util');

exports.isLoggedIn = async (req, res, next) => {
  //console.log(req.cookies);

  if (req.cookies.jwt) {
    try {
      // async returns a promise after the await
      // verify is from jwt web tokens
      // 1. Verify the token
      const decoded = await promisify(jwt.verify)(req.
        cookies.jwt,
        process.env.JWT_SECRET
      ); 
      //console.log(decoded);

      // 2. Check if the user still exists and get user info from DB
      var query = `
        SELECT * FROM User WHERE username = ?;
      `;
      connection.query(query, [decoded.username], function(error, result) {
        //console.log(result);

        if (!result) {
          return next();
        }
        req.user = result[0];

        return next();
      });
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    // accessable as req.message in function calling this middleware
    //req.message = "inside middleware";

    // no jwt token found
    next();
  }
}

// logs user out - not middleware, just controller function
exports.logout = async (req, res) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 2*1000),
    httpOnly: true
  });

  res.status(200).redirect('/');
}