const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'The service must have a name!'],
      trim: true,
      index: true,
      unique: [true, 'Service name must be unique.'],
    },
    price: {
      type: Number,
      required: [true, 'Please rate the service.'],
      validate: {
        validator: function (val) {
          return val >= 0;
        },
        message: 'Please enter valid price.',
      },
    },
    duration: {
      type: Number,
      required: [true, 'Please put duration in minute!'],
      validate: {
        validator: function (el) {
          return el > 0;
        },
        message: 'Please enter valid price. The minimum service is One min.',
      },
    },
    description: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    tags: [String],
  },
  {
    timestamps: true,
  },
);

serviceSchema.pre(/^find/, function () {
  this.find({ active: { $ne: false } });
});

const sercive = mongoose.model('Service', serviceSchema);
module.exports = sercive;
