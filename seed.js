
var db = require('./models');

Promise.all([db.User.remove({}), db.Booking.remove({}), db.Rental.remove({})]).then( () => {
  var UsersList = [{
                      name: "Rita",
                      gender: "F",
                      address:"225 Bush Street,SFO,CA",
                      email:"rita@airbnb.com",
                      password:"rita123@airbnb!!",
                      dob:"2000-02-26T20:15:58.503Z"
                   },
                   {  name: "Dexter",
                      gender:"M",
                      address:"224 Bush Street,SFO,CA",
                      email:"dexter@airbnb.com",
                      password:"dexter123@airbnb!!",
                      dob:"2000-02-26T20:15:58.503Z"
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
  UsersList[0].rentals=RentalsList[0];
  UsersList[1].rentals=RentalsList[1];
    db.User.create(UsersList, function(err, users){
      if (err) { return console.log('ERROR', err); }
      console.log("all users:", users);
      console.log("created", users.length, "users");
      process.exit();
    });
})
