var express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	User = require("../models/user");

router.get("/", (req, res) =>{
	res.render('landing');
});


// Auth routes

router.get("/register", (req, res) => {
	res.render("register");
});

router.post("/register", (req, res) => {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user) => {
		if(err){
			req.flash("error", err.message);
			return res.redirect("register");
		}
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "Welcome to YelpCamp  " + user.username);
			res.redirect("/campgrounds");
		});
	});
});


// login routes

router.get("/login", (req, res) =>{
	res.render("login");
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), (req, res) => {
	
});

// logout route
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "You have succesfully logged  out!");
	res.redirect("/campgrounds");
});

// ==================================================


module.exports = router;