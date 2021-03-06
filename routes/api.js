const express = require('express');
const router = new express.Router();
var controller = require('../controllers/controller.js');

router.get('/users', controller.all_users);
router.get('/users/:user_id/bookings',controller.get_userbooking);
router.get('/users/:user_id', controller.get_user);
router.get('/users/:user_id/rentals/:rental_id',controller.get_rental);
router.post('/users/:user_id/rentals/',controller.post_rental);
router.get('/rentals',controller.getall_rentals);
router.get('/rentals/:searchTerm',controller.getrentals_by_searchTerm);
router.post('/users/:user_id/rentals/:rental_id/booking',controller.post_booking);
router.delete('/users/:user_id/bookings/:booking_id',controller.delete_booking);
router.put('/users/:user_id/bookings/:booking_id',controller.update_booking);
router.delete('/users/:user_id/rentals/:rental_id',controller.delete_rental);


module.exports = router;
