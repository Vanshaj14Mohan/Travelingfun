const express = require("express");
const router = express.Router(); //acquiring router object
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema} =require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
//acquiring controller now
const listingController = require("../controllers/listings.js");
//acquiring multer for uploading files and then we initialize it
const multer  = require('multer');
const{storage} =require("../cloudConfig.js"); //requring storage from cloudinary
const upload = multer({storage}) //where we want to save our files.ie creates upload folder automatically

//reformating routes for index & create
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));
// .post(,(req,res)=>{
//     res.send(req.file);
// });

 //NEW ROUTE
 router.get("/new", isLoggedIn, listingController.newForm);

//same for id, update show & delete
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editForm));

module.exports = router;