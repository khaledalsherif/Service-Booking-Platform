const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const sanitizer = require('perfect-express-sanitizer');
const hpp = require('hpp');

const AppError = require('./Utils/appError');
const globalErrorHandler = require('./Controllers/errorController');

const userRouter = require('./Routes/userRoutes');
const serviceRouter = require('./Routes/serviceRoutes');
const bookingRouter = require('./Routes/bookingRoutes');

const app = express();

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour',
});

app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));
app.use(
  sanitizer.clean({
    xss: true,
    noSql: true,
    sql: false,
    noSqlLevel: 5,
    sanitizeKeys: true,
  }),
);
app.use(hpp());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/services', serviceRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
