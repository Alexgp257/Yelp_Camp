var express = require("express"),
	router = express.Router({mergeParams: true}),
	Campground = require("../models/campground"),
	Comment = require("../models/comments"),
	middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, (req, res) => {
	// 	find campground
	Campground.findById(req.params.id, (err, campground) =>{
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
	
});

router.post("/", middleware.isLoggedIn, (req, res) => {
// 	find campground using id
	Campground.findById(req.params.id, (err, campground) => {
		if(err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if(err) {
					req.flash("error", "Ups, something went wrong!");
					console.log(err);
				} else {
// 					add username to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
// 					save comment
					campground.comments.push(comment); 
					campground.save();
					req.flash("success", "Comment successfully added!");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});
// Comments edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});
// comments update route
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// comments destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if(err) {
			req.flash("error", "Ops....something went wrong");
			res.redirect("/campgrounds/" + req.params.id);
		} else {
			req.flash("success", "Comment succesfuly deleted!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


module.exports = router;