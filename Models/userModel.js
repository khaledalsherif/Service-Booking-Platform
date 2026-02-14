const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, 'A user name must have more or equal than 3 Charachter.'],
    maxLength: [10, 'A user name must have less or equal than 10 Charachter.'],
  },
  role: {
    type: String,
    enum: ['admin', 'employee', 'user'],
    default: 'user',
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: [validator.isEmail, 'Please provide a validate email.'],
    index: true,
  },
  password: {
    type: String,
    required: true,
    minLength: [
      4,
      'The password must be greater or equal than 4 charachter (must have num and chars)',
    ],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not the same!',
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.pre('save', function () {
  if (!this.isModified('password') || this.isNew) return;
  this.passwordChangedAt = Date.now() - 1000;
});

userSchema.pre(/^find/, function () {
  this.find({ active: { $ne: false } });
});

userSchema.methods.correctPassword = async (candidatePassword, userPassword) =>
  await bcrypt.compare(candidatePassword, userPassword);

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const user = mongoose.model('User', userSchema);
module.exports = user;
