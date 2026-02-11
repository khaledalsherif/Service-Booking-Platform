const Service = require('../Models/serviceModel');
const AppError = require('../Utils/appError');
const catchAsync = require('../Utils/catchAsync');
const APIFeatures = require('../Utils/apiFeatures');

exports.createService = catchAsync(async (req, res, next) => {
  const { name, price, duration, description, tags, active } = req.body;
  const service = await Service.create({
    name,
    price,
    duration,
    description,
    tags,
    active,
  });

  res.status(201).json({
    status: 'success',
    service,
  });
});

exports.deleteService = catchAsync(async (req, res, next) => {
  const service = await Service.findById(req.params.id);
  if (!service || service.length === 0 || !service.active) {
    return next(new AppError('There is no service with that id!', 404));
  }
  service.active = false;
  await service.save();
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllService = catchAsync(async (req, res, next) => {
  const feautres = new APIFeatures(Service.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const services = await feautres.query;
  res.status(200).json({
    status: 'success',
    len: services.length,
    data: {
      services,
    },
  });
});

exports.getService = catchAsync(async (req, res, next) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return next(new AppError('No service found with that id!', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      service,
    },
  });
});

exports.updateService = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!service) {
    return next(new AppError('No service found with that id!', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      service,
    },
  });
});
