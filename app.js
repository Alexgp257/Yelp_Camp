require('dotenv').config();
const express = require("express");
const app = express();
const request = require("request");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const methodOverride = require("method-override");
var seedDB = require("./seeds");
var User = require("./models/user");

// REQURING ROUTES
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");


// seedDB();
mongoose.connect(process.env.DATABASEURL, {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("DB Connected!!");
}).catch(err => {
	console.log("ERROR:", err.message);
});

var Campground = require("./models/campground");
var Comment = require("./models/comments");


app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

// passport config
app.use(session({
	secret: "clouds over your head prevents you to see the sun",
	store: new MongoStore({
		 mongooseConnection: mongoose.connection,
          collection: 'session',
	}),
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log("YelpCamp SERVER ONLINE!!!");
});