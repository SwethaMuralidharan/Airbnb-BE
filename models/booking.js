var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  User = require('./user'),
  Rental=require('./rental');

var BookingSchema = new Schema({
    user_id:      {type: Schema.Types.ObjectId, ref: 'User'},
    rental_id:    {type:Schema.Types.ObjectId,ref:'Rental'},
    booking_date: { type: Date, default: Date.now },
    start_date:   { type: Date, default: Date.now },
    end_date:     { type: Date, default: Date.now },
    total_cost:    Number
});

var Bookings = mongoose.model('Bookings', BookingSchema);

module.exports = Bookings;
