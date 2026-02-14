const catchAsync = require('../Utils/catchAsync');
const Service = require('../Models/serviceModel');
const Booking = require('../Models/bookingModel');
const AppError = require('../Utils/appError');
const APIFeatures = require('../Utils/apiFeatures');

exports.createBooking = catchAsync(async (req, res, next) => {
  const { serviceId } = req.body;
  const service = await Service.findById(serviceId);

  if (!service || !service.active) {
    return next(new AppError('There is no service exist with that id', 404));
  }

  const userId = req.user._id;

  const booking = await Booking.create({
    userId,
    serviceId,
    price: service.price,
    date: req.body.date,
  });

  res.status(201).json({
    status: 'success',
    booking,
  });
});

exports.getAllBooking = catchAsync(async (req, res, next) => {
  const feautres = new APIFeatures(Booking.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const bookings = await feautres.query;
  if (!bookings || bookings.length === 0) {
    return next(new AppError('There are no bookings there!', 404));
  }
  res.status(200).json({
    status: 'success',
    len: bookings.length,
    data: {
      bookings,
    },
  });
});

exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ userId: req.user._id });
  if (!bookings || bookings.length === 0 || bookings.status === 'cancelled') {
    next(new AppError('You have no bookings yet!', 404));
  }
  res.status(200).json({
    status: 'success',
    len: bookings.length,
    data: {
      bookings,
    },
  });
});

exports.updateStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return next(new AppError('There is no booking for that id!', 404));
  }
  const allowedStatus = ['pending', 'confirmed', 'cancelled'];

  if (!allowedStatus.includes(status)) {
    return next(new AppError('Invalid status update', 400));
  }

  booking.status = status;

  await booking.save();
  res.status(200).json({
    status: 'success',
    booking,
  });
});

exports.cancelBooking = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const booking = await Booking.findOne({ userId, _id: req.params.id });
  if (!booking || booking.status === 'cancelled') {
    return next(new AppError('There is no booking for that id!', 400));
  }
  booking.status = 'cancelled';
  await booking.save();
  res.status(204).json({
    status: 'success',
    booking: null,
  });
});
