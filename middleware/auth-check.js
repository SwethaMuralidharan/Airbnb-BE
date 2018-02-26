const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const config = require('../config');


/**
 *  The Auth Checker middleware function.
 */
module.exports = (req, res, next) => {
  if(req.method == "OPTIONS") {
    return next();
  }
  if (!req.headers.authorization) {
    return next();
    console.log(req.headers);
    console.log(req.method);
    console.log("not authorized")
    return res.status(401).send();
  }
  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];
  // decode the token using a secret key-phrase
  return jwt.verify(token, config.jwtSecret, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { return res.status(401).send(); }
    const userId = decoded.sub;
    // check if a user exists
    return User.findById(userId, (userErr, user) => {
      if (userErr || !user) {
        return res.status(401).send();
      }
      return next();
    });
  });
};
