const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const color = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to DB
connectDB();

// Route Files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();

// Body parser (included wiht express by default)
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File Uploading
app.use(fileupload());

// !IMPORTANT ----> Sanitize Data to Prevent NoSQL Injection <----
app.use(mongoSanitize());

// !IMPORTANT --->Set Security Headers<---
app.use(helmet());

// !IMPORTANT --->Prevent XSS attacks<---
app.use(xss());

// !IMPORTANT --->Rate Limiting access to API<---
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 Minutes
  max: 25 // --> 25 requests per 10 minutes
});

app.use(limiter);

// !IMPORTANT --->Prevent Http Params Pollution (HPP) attacks<---
// Make sure the body is parse beforehand for hpp to be effective
app.use(hpp());

// !IMPORTANT --->Enable CORS<---
app.use(cors());

// Set /public/uploads as a static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  // close server & exit process
  server.close(() => process.exit(1));
});
