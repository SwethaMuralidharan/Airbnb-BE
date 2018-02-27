const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config');


const app = express();

// app.use(express.static('./static/'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());

const localSignupStrategy = require('./passport/local-signup');
const localLoginStrategy = require('./passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

const authCheckMiddleware = require('./middleware/auth-check');



app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.REACT_APP_FRONT_END_URL);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  res.header("Access-Control-Allow-Methods", "PUT,GET,POST,DELETE");
  next();
});
app.use('/api', authCheckMiddleware);
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);


app.listen(process.env.PORT || 8080, function () {
  console.log('Express server is up and running on https://localhost:8080/');
});
