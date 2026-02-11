const mongoose = require('mongoose');
const AppError = require('../Utils/appError');
const User = require('./userModel');

const bookingSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'The booking must be linked to a user.'],
      index: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'The booking must be linked to a service.'],
      index: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    price: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);
bookingSchema.index({ userId: 1, serviceId: 1, date: 1 }, { unique: true }); //To ensure that service doesn't booking after this one.

//hooks
bookingSchema.pre('save', function () {
  if (!this.isModified('date')) return;
  if (this.date.getTime() + 1000 < Date.now())
    throw new AppError('Invalid date!', 400);
});

bookingSchema.pre(/^find/, function () {
  this.populate({
    path: 'userId',
    select: 'name',
  }).populate({
    path: 'serviceId',
    select: 'name price',
  });
});

const booking = mongoose.model('Booking', bookingSchema);
module.exports = booking;
