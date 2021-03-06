const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const movieRouter = require('./routes/movie');
const directorRouter = require('./routes/director'); 

const app = express();

// DB Connect
const db = require('./helper/db')();
// Config
const config = require('./config');
app.set('api_secret_key', config.api_secret_key);
// Middleware
const verifyToken = require('./middleware/verify-token');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api',verifyToken);
app.use('/', usersRouter);
app.use('/api/movies',movieRouter);
app.use('/api/directors',directorRouter);

// catch 404 and forward to error handler
app.use((req, res, next) =>{
  next(createError(404));
});

// error handler
app.use((err, req, res, next) =>{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
  res.json({error:{message:err.message,code:err.code}});
});

module.exports = app;
