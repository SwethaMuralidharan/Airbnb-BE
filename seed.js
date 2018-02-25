
var db = require('./models');

db.User.remove_all
db.Booking.remove_all
db.Rental.remove_all

var UsersList = [{
                    name: "Rita",
                    gender: "F",
                    address:"225 Bush Street,SFO,CA",
                    email:"rita@airbnb.com",
                    password:"rita123@airbnb!!"
                 },
                 {  name: "Dexter",
                    gender:"M",
                    address:"224 Bush Street,SFO,CA",
                    email:"dexter@airbnb.com",
                    password:"dexter123@airbnb!!"
                 }
                ];
var RentalsList=[{
                    address:"225 Bush Street,SFO,CA",
                    rooms:1,
                    bathrooms:1,
                    max_guest:2,
                    price_per_night:80,
                    amenities:"Wifi,SmartTv,Breakfast,washer,Iron",
                    image_urls:["https://a0.muscache.com/im/pictures/11341175/20662903_original.jpg?aki_policy=large",
                                "https://a0.muscache.com/im/pictures/11341171/d5ca49b5_original.jpg?aki_policy=xx_large"]

                },
                {
                    address:"120 Market Street,SFO,CA",
                    rooms:2,
                    bathrooms:1,
                    max_guest:4,
                    price_per_night:120,
                    amenities:"Wifi,SmartTv,Breakfast,washer,Iron",
                    image_urls:["https://a0.muscache.com/im/pictures/79452273/12bc436d_original.jpg?aki_policy=large",
                                "https://a0.muscache.com/im/pictures/79451711/24dda9d9_original.jpg?aki_policy=x_large"]

                }
                ]


// UsersList.forEach(function(user){
//   user.rentals = RentalsList;
// });

UsersList[0].rentals=RentalsList[0];
UsersList[1].rentals=RentalsList[1];

db.User.remove({}, function(err, users){
  // code in here runs after all users are removed
  db.User.create(UsersList, function(err, users){
    // code in here runs after all users are created
    if (err) { return console.log('ERROR', err); }
    console.log("all users:", users);
    console.log("created", users.length, "users");
    process.exit();
  });
});
