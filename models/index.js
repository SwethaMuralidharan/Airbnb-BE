const mongoose = require('mongoose');
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/react_app");

// load models
module.exports.User = require('./user');
module.exports.Rental = require('./rental');
module.exports.Booking = require('./booking');
