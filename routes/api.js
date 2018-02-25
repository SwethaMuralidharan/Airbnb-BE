const express = require('express');
const router = new express.Router();
var controller = require('../controllers/controller.js');



router.get('/dashboard', (req, res) => {
  res.status(200).json({
    message: "You're authorized to see this secret message."
  });
});

router.get('/users', controller.all_users);
router.get('/users/:user_id/bookings',controller.get_userbooking);
router.get('/users/:user_id', controller.get_user);
router.get('/users/:user_id/rentals/:rental_id',controller.get_rental);
router.post('/users/:user_id/rentals/',controller.post_rental);
router.get('/rentals',controller.getall_rentals);
router.get('/rentals/:searchTerm',controller.getrentals_by_searchTerm);
router.post('/users/:user_id/rentals/:rental_id/booking',controller.post_booking);
router.delete('/users/:user_id/bookings/:booking_id',controller.delete_booking);


module.exports = router;
