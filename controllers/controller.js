var models = require('../models');
var User = models.User;
var Rental=models.Rental;
var Booking=models.Booking;

//GET all users
function all_users(req, res){
  User.find({}, function(err, users) {
    if (err) { console.log(err)}
    res.json(users)
  })
}

// GET one user
function get_user(req, res){
  console.log("Getting User",req.params.user_id);
   User.findById(req.params.user_id, function(err, user) {
    console.log(user);
		res.json(user);
	});
}

//GET one rental by Id
function get_rental(req,res){
    var user_id=req.params.user_id;
    var rental_id=req.params.rental_id;
    User.findById(user_id).exec(function(err,foundUser){
      if(err){
        console.log("error in finding user ",err)
      }
      else{
            var rental=foundUser.rentals.id(rental_id);
            res.json(rental);
          }
    })
}

//POST a RENTAL
function post_rental(req,res){
      var user_id=req.params.user_id;
      User.findById(user_id).exec(function(err,foundUser){
      if(err) {
        console.log(err);
      }
      else if(foundUser===null) {
        res.status(404).json({error:"No user found by this ID"});
      }
      else {
        var newRental = new Rental(req.body);
        newRental.save((err) => {
          if (err) { console.log(err); }
        });
        foundUser.rentals.push(newRental);
      }
      foundUser.save();
      console.log("Updateduser is ",foundUser);
      res.json(foundUser);
      })
}

//GET All rentals
function getall_rentals(req,res){
  console.log("Getting All Rentals");
  Rental.find({}, function(err, rentals) {
    if (err) { console.log(err)}
    console.log(rentals);
    res.json(rentals);
  })
}

//GET searchItem
function getrentals_by_searchTerm(req,res){
  Rental.find({address:new RegExp(req.params.searchTerm),max_guest:{ $gte: req.query.max_guests },price_per_night: { $gt:0,$lte: req.query.price_per_night }},function(err,foundRental){
    if(err){console.log(err)}
    res.json(foundRental);
  })
}

//DELETE A RENTAL BY ID
function delete_rental(req,res){
    var rental_id=req.params.rental_id;
    var user_id=req.params.user_id;
    User.findById(user_id).exec(function(err,foundUser){
      if(err){
        console.log("error in deleting rentals ",err)
      }
      else{

            var deleted_rental=foundUser.rentals.id(rental_id);
            deleted_rental.remove();
            foundUser.save(function(err,savedUser){
              Rental.findOneAndRemove({ _id: rental_id }, function (err, deletedRental) {
              res.json(savedUser);
              })
            })
         }
    })
}

//POST A BOOKING
function post_booking(req,res){
  var user_id=req.params.user_id;
  var rental_id = req.params.rental_id;
  var newBooking = new Booking(req.body);
  newBooking.save(function(err,savedBooking){
    if(err){
        res.send(err);
    }
    else{
        console.log("booking is saved",newBooking);
        Rental.findById(rental_id).exec(function(err,foundRental){
        console.log("found rental",foundRental);
          if(err) {
            console.log(err);
          }
          else if(foundRental===null) {
            res.status(404).json({error:"No rental found by this ID"});
          }
          else {
            foundRental.bookings.push(newBooking._id);
        }})

        User.findById(user_id).exec(function(err,foundUser){
          if(err) {
            console.log(err);
          }
          else if(foundUser===null) {
            res.status(404).json({error:"No user found by this ID"});
          }
          else {
              foundUser.bookings.push(newBooking._id);
          }
          foundUser.save();
          res.json(foundUser);
        })
    }
  });
}

//GET USER'S BOOKING
function get_userbooking(req,res){
  console.log("Getting User's BookingList");
  var user_id=req.params.user_id;
  User.findById(user_id).populate({path:'bookings',populate:{path:'rental_id'}}).exec(function(err,foundUser){
    if(err){
      console.log("error in finding user ",err)
    }
    else{
          console.log(foundUser);
          res.json(foundUser);
        }
  })
}


//DELETE BOOKING
function delete_booking(req,res){
  var booking_id=req.params.booking_id;
  var user_id=req.params.user_id;

  Booking.findOneAndRemove({ _id: booking_id }, function (err, deletedBooking) {
    User.findById(user_id).exec(function(err,foundUser){
      foundUser.bookings.remove(booking_id);
      foundUser.save(function(err,removedFromUser){
        console.log(removedFromUser);
        res.json(removedFromUser);
      });
    })
  });
}

//UPDATE A BOOKING
function update_booking(req,res){
  Booking.findByIdAndUpdate(
            req.params.booking_id,
            {$set:
                {
                  'start_date':req.body.start_date,
                  'end_date':req.body.end_date,
                  'total_cost':req.body.total_cost,
                  'total_guests':req.body.total_guests
                }
            },
            {new:true},
            function(err,updatedBooking){
              if(err){
                  res.json({error :err}) ;
              } else{
                User.findById(req.params.user_id).populate({path:'bookings',populate:{path:'rental_id'}}).exec(function(err,foundUser){
                  if(err){
                    console.log("error in finding user ",err)
                  }
                  else{
                        console.log(foundUser);
                        res.json(foundUser);
                      }
                })
              }
            })
}


//UPDATE A RENTAL
function update_rental(req,res){
  var rental_id=req.params.rental_id;
  var user_id=req.params.user_id;
  User.findById(user_id).exec(function(err,foundUser){
    if(err){
      console.log("error in updating rentals ",err)
    }
    else{
          var updated_rental=foundUser.rentals.id(rental_id);
          if(updated_rental){
            updated_rental.address=req.body.address;
            updated_rental.rooms=req.body.rooms;
            updated_rental.bed=req.body.bed;
            updated_rental.bathrooms=req.body.bathrooms;
            updated_rental.max_guest=req.body.max_guest;
            updated_rental.price_per_night=req.body.price_per_night;
            updated_rental.amenities=req.body.amenities;
            updated_rental.amenities=req.body.amenities;
            updated_rental.image_urls=req.body.image_urls;

             foundUser.save(function(err,savedRental){
               console.log("updated_rental",updated_rental);
               res.json(savedRental);
            })
          }
        }
  })
}


module.exports = {
  all_users: all_users,
  get_user: get_user,
  get_rental:get_rental,
  post_rental:post_rental,
  getall_rentals:getall_rentals,
  getrentals_by_searchTerm:getrentals_by_searchTerm,
  post_booking:post_booking,
  get_userbooking:get_userbooking,
  delete_booking:delete_booking,
  update_booking:update_booking,
  delete_rental:delete_rental,
  update_rental:update_rental
};
