const {CampgroundSchema , reviewSchema} = require("./schemas")
const ExpressError = require('./utils/ExpressError')
const Campground = require('./modles/campground.js');
const Review = require('./modles/review.js');


module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated())
    {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must me signed in');
        return res.redirect('/login');
    }
    else
        next()
}

module.exports.validateCampground = (req,res,next) => {
    const {error} = CampgroundSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg,400);
    }
    else 
        next();
}

module.exports.isAuthor = async (req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id))
    {
        req.flash('error',"You don't have the access to do that");
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    const {id,reviewId} = req.params;
    console.log(id);
    console.log(reviewId);
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id))
    {
        req.flash('error',"You don't have the access to do that");
        console.log(`/campgrounds/${id}/reviews/${reviewId}`);
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

