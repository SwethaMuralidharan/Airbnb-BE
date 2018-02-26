const User = require('../models').User;
const PassportLocalStrategy = require('passport-local').Strategy;


/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  const userData = {
    email: email.trim(),
    password: password.trim(),
    name: req.body.name.trim(),
    dob:req.body.dob.trim(),
    gender:req.body.gender.trim(),
    address:req.body.address.trim()
  };
  const newUser = new User(userData);
  newUser.save((err) => {
    if (err) { return done(err); }
    return done(null);
  });
});
