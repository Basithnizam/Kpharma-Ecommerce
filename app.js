var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectMongo = require('./configuration/configDb.js');
const session = require('express-session');
require('dotenv').config()
var flash = require('connect-flash');






var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
// const { Collection } = require('mongoose');

var app = express();


//MongoDB Connection
connectMongo(process.env.MONGODB_URI)



// view engine setup
// app.set('views', path.join(__dirname, 'app/views/user'));
app.set('views', [__dirname + '/app/views/user', __dirname + '/app/views/admin']);

app.set('view engine', 'ejs');



app.set('view cache', false);

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// Session and Cookie
app.use(session({
  secret: 'your-secret-key', // Replace with a secret key for session encryption
  resave: false,
  saveUninitialized: true
}));
app.use(flash())



app.use('/admin', adminRouter);
app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
