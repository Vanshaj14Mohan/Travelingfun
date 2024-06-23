const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} =require("./schema.js");

module.exports.isLoggedIn = (req,res,next) =>{
    // console.log(req.user);to check if we are logged in or not.
    // console.log(req);//show details of our req 
    // console.log(req.path, "..", req.originalUrl); //shows complete url which we are trying to access.
    if(!req.isAuthenticated()){
        //originalUrl save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/login");
     }
     next();
};

module.exports.saveRedirectUrl =(req,res,next)=>{
    if( req.session.redirectUrl){ //if it exists
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){ //to check listing owner is curr user before updating
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

//using validate listing as a middleware..
module.exports.validateListing = (req,res,next) =>{
    let {error} =listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

//using validate review as a middleware..
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){ //to check listing owner is curr user before updating
        req.flash("error", "You did not created this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};