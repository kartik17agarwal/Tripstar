const express = require('express')
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const {reviewSchema} = require("../schemas")
const {isLoggedIn,isReviewAuthor} = require('../middelware')
const reviews = require('../controllers/reviews')

const validateReview = (req,res,next)=>{
    //console.log(req.body);
    const {error} = reviewSchema.validate(req.body);
    //console.log(error)
    if(error)
    {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg,400);
    }
    else 
        next();
}

router.post('/',isLoggedIn, validateReview ,catchAsync(reviews.createReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;