const express = require('express');
const authController = require('../Controllers/authController');
const serviceController = require('../Controllers/serviceController');

const router = express.Router();

router
  .route('/')
  .get(serviceController.getAllService)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    serviceController.createService,
  );
router
  .route('/:id')
  .get(authController.protect, serviceController.getService)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    serviceController.updateService,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    serviceController.deleteService,
  );
module.exports = router;
