// Filename - App.js

const express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = 
		require("passport-local-mongoose")
const User = require("./model/User");
let app = express();

mongoose.connect("mongodb://localhost/27017");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
	secret: "Rusty is a dog",
	resave: false,
	saveUninitialized: false
}));




app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=====================
// ROUTES
//=====================

// Showing home page
app.get("/", function (req, res) {
	res.render("home");
});

// Showing Dashboard page
app.get("/dashboard", isLoggedIn, function (req, res) {
	res.render("dashboard");
});

// /submit project
app.get("/submitProject", function (req, res) {
	res.render("submitProject");
});







///showing great PAGE



// Assume you have a function to handle user registration
const registerUser = (req, res) => {
  // Logic to handle user registration

  // Redirect to the "great" page upon successful registration
  res.redirect('/great');
};

// Registration route
app.post('/register', registerUser);

// Showing the "great" page
app.get('/great', (req, res) => {
  res.render('great'); // Assuming you have a template engine set up for rendering pages
});







// Showing register form
app.get("/register", function (req, res) {
	res.render("register");
});



//Showing login form
app.get("/login", function (req, res) {
	res.render("login");
});

//Handling user login
app.post("/login", async function(req, res){
	try {
		// check if the user exists
		const user = await User.findOne({ username: req.body.username });
		if (user) {
		//check if password matches
		const result = req.body.password === user.password;
		if (result) {
			res.render("dashboard");
		} else {
			res.status(400).json({ error: "password doesn't match" });
		}
		} else {
		res.status(400).json({ error: "User doesn't exist" });
		}
	} catch (error) {
		res.status(400).json({ error });
	}
});
// apply css
app.use(express.static('public'));


//Handling user logout 
app.get("/logout", function (req, res) {
	req.logout(function(err) {
		if (err) { return next(err); }
		res.redirect('/');
	});
});


// Middleware to check if a user is logged in
function isLoggedIn(req, res, next) {
	// Check if the user is logged in, you can customize this based on your authentication logic
	if (req.isAuthenticated()) {
	  return next(); // User is logged in, proceed to the next middleware
	}
  
	// User is not logged in, you can redirect them to a login page or handle as needed
	res.redirect('/login'); // Redirect to the login page
  }



// ///====  port ====

let port = process.env.PORT || 3001;
app.listen(port, function () {
	console.log("Server Has Started!");

});