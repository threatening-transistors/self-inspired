//server stuff goes here!
var express = require('express');
var session = require('express-session');
var path = require('path');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var chalk = require('chalk');
var passport = require('passport');
var flash = require('connect-flash');
var methodOverride = require('method-override');
var schedule = require('node-schedule');
var mongoose = require('mongoose');
var db = require('./db');
var fs = require('fs');
var nunjucks = require('nunjucks');

// MONGOOSE
mongo_uri = process.env.MONGO_URI || 'mongodb://threatening:transistors@ds061360.mongolab.com:61360/heroku_app32253810';
mongoose.connect(mongo_uri);
var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function callback () {
  console.log("Successful connection to database");
});

// inputting user / data as a test on database


//this will add a new user to the database, we can add a test case for authentication later
// var testUser = new db.User({name:"hello", email:"cool@gmail.com", password:"test123"});
// testUser.save(function (err) {if (err) console.log ('Error on save!')});

db.User.find({name:"hello"}).exec(function(err, result) {
  if (!err) {
    console.log(result);
  } else {
    console.log("error");
  }
});

// Code below will grab goals by user id once it is available on database.

// db.Goals.find({userId:''}).exec(function(err, result) {
//   if (!err) {
//     console.log(result);
//   } else{
//     console.log("error");
//   }
// })


//for email
var api_key = 'key-e81b3d37fc5adcc1bc5c21f5267a90d5';
var domain = 'selfinspi.red';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
//// for email
var app = express();                                            //  setup express server
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(session({ secret: 'DeRaNiRa' }));                       // session secret
app.use(passport.initialize());
app.use(passport.session());                                    // persistent login sessions
app.use(flash());                                               // use connect-flash for flash messages stored in session
app.use(methodOverride());
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));


require('./passport')(passport);                                // pass passport for configuration
//require('./app/routes.js')(app, passport);

var goals = [];


//tasks array for testing

app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

//.authenticate with local-sign from passport on a post request on logon page.
app.post('/login', passport.authenticate('local-signin', { 
  successRedirect: '/',
  failureRedirect: '/signin'
  })
);

//on logout this will call the logout function and terminate users current session.
app.get('/logout', function(req, res){
  var name = req.user.username;
  console.log("LOGGIN OUT " + req.user.username)
  req.logout(); //implement
  res.redirect('/');
  req.session.notice = "You have successfully been logged out " + name + "!";
});

app.delete('/goals/:id', function(req, res) {
  if(goals.length <= req.params.id) { // modify this part depending on data model id =index
    res.statusCode = 404;
    return res.send('Error 404: No quote found');
  }  

	goals.splice(req.params.id, 1); // deletes the slected goal
  res.json(true);
});

app.post('/goals', function(req,res){
	goals.push(req.body);
  //console.log('req.body: ', req.body);
  var goalData = req.body;
  var goalText= goalData.goalContent;
  var startDate = goalData.startDate
  var dueDate = goalData.endDate;
  var why = goalData.why;
  var freq;
  for(var key in goalData.freq){
    if(goalData.freq[key]){
      freq = key;
    }
  }

// will send an email to user on post request /goals  
  var testData = {
  name: "Rachel",
  goal: goalData.goal,
  daysAway: '3 days away',
  reason: why
}
var htmlPath = './public/emailTemplate.html'; 
var htmlContent = fs.readFileSync(htmlPath,'utf8');
var response = nunjucks.renderString(htmlContent, testData);
var emailData = {
  from: 'Excited User <hazeeee@gmail.com>',
  to: 'hazeeee@gmail.com',
  subject: 'your goal!',
  html: response
};
var date = new Date(2014, 11, 04, 22, 54, 0); // will send an email at this time this data used for testing purposes

//   var goalToAdd = req.body;
//   db.Goals.findOne({'userId': 1}, function(err, goals){
//     if(!goals){
      
//     goals.push(goalToAdd);
//     goals.save(function(err){
//       if(err){
//         res.send(err);
//       }
//       res.status(201).send("Goal Added successfully");
//     });
//   });
})




// var j = schedule.scheduleJob(date, function(){
//   mailgun.messages().send(emailData, function (error, body) {
//   console.log(body);
// });
// });
//// end of email to user on post request

// })


app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function(){
  console.log("Applet listening on port " + process.env.PORT);
});


//******************************************************************************************
/*

this is the documentation for how to create a message (api_key is legit):
***************
var api_key = 'key-e81b3d37fc5adcc1bc5c21f5267a90d5';
var domain = 'selfinspi.red';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

var data = {
  from: 'Excited User <rsison87@gmail.com>',
  to: 'derek.barncard@gmail.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness! TEST2!!'
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
*/


// //input from form is saved to these variables
// var goal;
// var inspiration;
// var emailAddress;
// var frequency;
// var user;
//then input into this function:
// var sendMessageSetInterval = function (goal, inspiration, emailAddress, frequency, user){
//   var data = {
//     from: 'Reminder Team <reminders.selfinspi.red>',
//     to: emailAddress,
//     subject: "Hello" + user + ", just a reminder about WHY you're doing what you're doing!",
//     text: inspiration // 
//   }
  // var timerFunction(data) {
  //   mailgun.messages.send(data, function error, body){
  //   console.log(body);
  // }










