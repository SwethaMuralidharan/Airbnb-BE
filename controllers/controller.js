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
        foundUser.rentals.push(req.body);
      }
      foundUser.save();
      console.log("Updateduser is ",foundUser);
      res.json(foundUser);
      })
}




module.exports = {
  all_users: all_users,
  get_user: get_user,
  get_rental:get_rental,
  post_rental:post_rental
};
