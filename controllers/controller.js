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




module.exports = {
  all_users: all_users,
  get_user: get_user,
  get_rental:get_rental
};
