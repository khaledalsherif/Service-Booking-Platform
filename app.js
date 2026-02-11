const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const sanitizer = require('perfect-express-sanitizer');
const hpp = require('hpp');

const AppError = require('./Utils/appError');
const globalErrorHandler = require('./Controllers/errorController');

//Routes
const userRouter = require('./Routes/userRoutes');
const serviceRouter = require('./Routes/serviceRoutes');
const bookingRouter = require('./Routes/bookingRoutes');

const app = express();
//--MiddleWares

//Set security HTTP Headers.
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
console.log(process.env.NODE_ENV);
//limiting reqs
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour',
});

app.use('/api', limiter);
//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
//Data sanitize against NoSql query injection ,Data sanitize against xss
app.use(
  sanitizer.clean({
    xss: true,
    noSql: true,
    sql: false,
    noSqlLevel: 5,
    sanitizeKeys: true,
  }),
);
//Prevent parameter pollution
app.use(hpp());
//Functions
app.use('/api/v1/users', userRouter);
app.use('/api/v1/services', serviceRouter);
app.use('/api/v1/bookings', bookingRouter);
//unhandled Route
app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
