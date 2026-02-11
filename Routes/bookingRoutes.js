const express = require('express');

const authController = require('../Controllers/authController');
const bookingController = require('../Controllers/bookingController');

const router = express.Router();

//router.use(authController.protect)
router.get(
  '/getMyBooking',
  authController.protect,
  bookingController.getMyBooking,
);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    bookingController.getAllBooking,
  )
  .post(authController.protect, bookingController.createBooking);

router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'employee'),
    bookingController.updateStatus,
  )
  .delete(authController.protect, bookingController.cancelBooking);

module.exports = router;
