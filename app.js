var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//mail helper class
var helper = require('sendgrid').mail;
var from_email = new helper.Email('md.khaled.eee@gmail.com');
var to_email = new helper.Email('tokyo_emb@yahoo.com');
var subject = 'Hello World from the SendGrid Node.js Library!';
var subjectDB = 'Database Notification from NCS 7th floor';
var content = new helper.Content('text/plain', 'Ncs App just started!');
var contentDB = new helper.Content('text/plain', 'Database is disconeected');
var mail = new helper.Mail(from_email, subject, to_email, content);
var mailDB = new helper.Mail(from_email, subjectDB, to_email, contentDB);
 
var sg = require('sendgrid')('jkjkjljljljlkjlkj');


var request = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: mail.toJSON(),
});

var requestDB = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: mailDB.toJSON(),
});

sg.API(request, function(error, response) {
  console.log(response.statusCode);
  console.log(response.body);
  console.log(response.headers);
});

//mongodb connection
var mongoURI = 'mongodb://ncsV1:ncsV1@localhost:27017/ncsV1';
var db = mongoose.connect(mongoURI,{ server: { reconnectTries: Number.MAX_VALUE } }).connection;
db.on('error', function(err){console.log(err.message); });

db.once('open', function(){
	console.log("mongodb connection open");
});

db.on('disconnected',function(ref){
	console.log('disconnected connection');
	//send mail that database is disconnected
	sg.API(requestDB, function(error, response) {
  	   console.log(response.statusCode);
 	   console.log(response.body);
 	   console.log(response.headers);
	});

});

db.on('disconnect', function(err){
	console.log('Error....disconnect',err);
});

//Routes

var callList = require('./routes/callListRoutes'); 					// Mamshad
var deviceList = require('./routes/deviceListRoutes');        // Mamshad
var callHistory = require('./routes/callHistoryRoutes');        // Mamshad

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(require('node-sass-middleware')({
//  src: path.join(__dirname, 'public'),
//  dest: path.join(__dirname, 'public'),
//  indentedSyntax: true,
//  sourceMap: true
//}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use('/', callList);
app.use('/calls', callList); 			// Mamshad
app.use('/devices', deviceList);    // Mamshad
app.use('/callhistory', callHistory);    // Mamshad


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
