var models = require('../models');
var User = models.User;
var Rental=models.Rental;

function all_users(req, res) {
  User.find({}, function(err, users) {
    if (err) { console.log(err)}
    res.json(users)
  })
}
// GET one user
function get_user(req, res) {
  console.log("get user called");
  console.log("user id ",req.params.user_id);
   User.findById(req.params.user_id, function(err, user) {
    console.log(user);
		res.json(user);
	});
}

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
function post_rental(req,res){
      var user_id=req.params.user_id;
      User.findById(user_id).exec(function(err,foundUser){
      console.log("request from front end is",req.body);
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
function getall_rentals(req,res){
  console.log("getall rentals called");
  Rental.find({}, function(err, rentals) {
    if (err) { console.log(err)}
    console.log(rentals);
    res.json(rentals);
  })
}


function getrentals_by_searchTerm(req,res){
  console.log("getrentals_by_searchTerm called");
  console.log("max_guests",req.query.max_guests);
  console.log("request from FE",req.params.searchTerm);
  Rental.find({address:new RegExp(req.params.searchTerm),max_guest:{ $gt: 0, $lte: req.query.max_guests },price_per_night: { $gt:0,$lte: req.query.price_per_night }},function(err,foundRental){
    if(err){console.log(err)}
    console.log(foundRental);
    res.json(foundRental);
  })
}

module.exports = {
  all_users: all_users,
  get_user: get_user,
  get_rental:get_rental,
  post_rental:post_rental,
  getall_rentals:getall_rentals,
  getrentals_by_searchTerm:getrentals_by_searchTerm
};
