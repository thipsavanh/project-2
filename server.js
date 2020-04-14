// Requiring necessary npm packages
var express = require("express");
var session = require("express-session");
// Requiring passport as we've configured it
var passport = require("./config/passport");


var path = require('path');
var bodyParser = require('body-parser');

// var Pusher = require('pusher');

// var pusher = new Pusher({
//     appId: '979597',
//     key: 'fa885a6ad4dfa25e855b',
//     secret: 'c1dea7cde1aa39a86b01',
//     cluster: 'us2',
//     encrypted: true
// });

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 8080;
var db = require("./models");

// Creating express app and configuring middleware needed for authentication
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Error Handler for 404 Pages
// app.use(function(req, res, next) {
//   var error404 = new Error('Route Not Found');
//   error404.status = 404;
//   next(error404);
// });



// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Syncing our database and logging a message to the user upon success

db.sequelize.sync({}).then(function() {
    app.listen(PORT, function() {
        console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    });

});