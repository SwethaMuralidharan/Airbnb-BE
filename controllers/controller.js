var models = require('../models');
var daterange = require('daterange');
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
            Rental.findById(rental_id).populate('user_id').exec(function(err,rental){
                console.log("rental info from backend:",rental);
                res.json(rental);
            });
            // var rental=foundUser.rentals.id(rental_id);
            // console.log("rental info from backend:",rental)
            // res.json(rental);
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
  Rental.find({
                address:new RegExp(req.params.searchTerm, "i"),
                max_guest:{ $gte: req.query.max_guests },
                price_per_night: { $gt:0,$lte: req.query.price_per_night }
              })
    .populate('bookings')
    .exec(function(err, foundRental) {
      if (err){
        console.log(err);
      }
      console.log("all search results",foundRental);
      var range1=null;
      var range2=null;
      var isoverlapped=false;
      let filteredRentals=foundRental;
      for(i=0;i<foundRental.length;i++){
        for(j=0;j<foundRental[i].bookings.length;j++){
          range1=daterange.create( new Date(foundRental[i].bookings[j].start_date),new Date(foundRental[i].bookings[j].end_date));
          range2 = daterange.create( new Date(req.query.from_date),new Date(req.query.to_date));
          console.log("range1",range1);
          console.log("range2",range2);
          console.log("Overlap?",range1.overlaps(range2));
          if(range1.overlaps(range2)){
              isoverlapped=true;
              break;
          }
        }
        if(isoverlapped){
            filteredRentals=foundRental.filter(function(eachRental) {
             return eachRental._id !== foundRental[i]._id
           });
          isoverlapped=false;
        }
      }
      console.log("filtered rentals",filteredRentals);
      res.json(filteredRentals);
    });
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
  var allowed_guest_count=0;
  console.log("Rental Id choosen",rental_id);
  var newBooking = new Booking(req.body);
  Rental.findById(rental_id).exec(function(err,foundRental){
      allowed_guest_count=foundRental.max_guest;

  //start testing
  Booking.find({ rental_id: rental_id }).populate('rental_id').exec(function(err,founditem){
      console.log("founditem",founditem);
      // allowed_guest_count=founditem[0].rental_id.max_guest
      //loop through founditem and create a range for each an compare with input range.
      // allow this booking to save only when the overlaps is false for all entries in founditem.
      var range1=null;
      var range2=null;
      var isoverlapped=false;
      for(i=0;i<founditem.length;i++){
          range1=daterange.create( new Date(founditem[i].start_date),new Date(founditem[i].end_date));
          range2 = daterange.create( new Date(req.body.start_date),new Date(req.body.end_date));
          if(range1.overlaps(range2)){
              isoverlapped=true;
              break;
          }
      }
     if(isoverlapped===false && req.body.total_guests<=allowed_guest_count){
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
                  }
                  foundRental.save();
                });

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
      else{
        console.log("Error: Booking dates overlap or guest count exceeded or both");
        if((isoverlapped)&&(req.body.total_guests>allowed_guest_count)){
          res.json("Error: Already booked on the selected dates and guest count exceeded the limit");
        }
        else if(isoverlapped){
          res.json("Error: Already booked on the selected dates");
        }
        else if(req.body.total_guests>allowed_guest_count){
          res.json("Error: Guest Count exceeded the limit");
        }
      }
  });
})
  //end testing

}

//GET USER'S BOOKING
function get_userbooking(req,res){
  console.log("Getting User's BookingList");
  var user_id=req.params.user_id;
  User.findById(user_id).populate({path:'bookings',populate:{path:'rental_id',populate:{path:'user_id'}}}).exec(function(err,foundUser){
    if(err){
      console.log("error in finding user ",err)
    }
    else{
          console.log("user bookings list",foundUser);
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
  var isoverlapped=false;
  var allowed_guest_count=0;
  console.log("params",req.params.booking_id);
  Booking.find({ _id: req.params.booking_id })
         .populate('rental_id')
         .exec(function(err,foundbooking){
             booking_obj = foundbooking;
             allowed_guest_count=booking_obj[0].rental_id.max_guest;
             var rental_id=foundbooking[0].rental_id._id;
             Booking.find({ rental_id: rental_id })
                    .exec(function(err,founditem){
                     console.log("before filter",founditem);
                     let filtered=founditem.filter(function(eachBooking) {
                      return eachBooking._id != req.params.booking_id
                    });
                    console.log("after filter",filtered);
                      var range1=null;
                      var range2=null;
                      for(i=0;i<filtered.length;i++){
                          range1 = daterange.create( new Date(filtered[i].start_date),new Date(filtered[i].end_date));
                          range2 = daterange.create( new Date(req.body.start_date),new Date(req.body.end_date));
                          if(range1.overlaps(range2)){
                              isoverlapped=true;
                              break;
                          }
                      }
                      console.log("Overlap?",isoverlapped);
                      if(isoverlapped==false && req.body.total_guests<=allowed_guest_count){
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
                                      User.findById(req.params.user_id).populate({path:'bookings',populate:{path:'rental_id',populate:{path:'user_id'}}}).exec(function(err,foundUser){
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
                          else{
                            console.log("Error: Booking dates overlap or guest count exceeded or both");
                            if((isoverlapped)&&(req.body.total_guests>allowed_guest_count)){
                              res.json("Error: Already booked on the selected dates and guest count exceeded the limit");
                            }
                            else if(isoverlapped){
                              res.json("Error: Already booked on the selected dates");
                            }
                            else if(req.body.total_guests>allowed_guest_count){
                              res.json("Error: Guest Count exceeded the limit");
                            }
                        }
                    })
          });
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
