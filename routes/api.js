const express = require('express');
const router = new express.Router();
var controller = require('../controllers/controller.js');



router.get('/dashboard', (req, res) => {
  res.status(200).json({
    message: "You're authorized to see this secret message."
  });
});

router.get('/users', controller.all_users);
router.get('/users/:user_id', controller.get_user);
router.get('/users/:user_id/rentals/:rental_id',controller.get_rental);

module.exports = router;
