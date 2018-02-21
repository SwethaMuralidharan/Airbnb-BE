var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  User = require('./user'),
  Bookings=require('./booking');

var RentalSchema = new Schema({
      user_id:{type: Schema.Types.ObjectId, ref:'User'},
      address:String,
      rooms:Number,
      bathrooms:Number,
      max_guest:Number,
      price_per_night:Number,
      amenities:String,
      bookings:[Bookings.schema],
      image_urls:[]
});

var Rental = mongoose.model('Rental', RentalSchema);

module.exports = Rental;
