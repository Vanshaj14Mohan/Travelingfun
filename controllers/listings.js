const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); //requiring mapbox sdk
const mapToken = process.env.MAP_TOKEN; //requiring access token
const geocodingClient = mbxGeocoding({ accessToken: mapToken }); //creating base client

module.exports.index =async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
 };

module.exports.newForm =(req,res)=>{
    res.render("listings/new.ejs");
};


module.exports.showListing =async(req,res)=>{
    let {id} =req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"},
    }).populate("owner");
    if(!listing){
        req.flash("error", "Requested listing does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing =async (req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location, //coordinates of the location
    limit: 1,
   })
  .send();

  //console.log(response.body.features[0].geometry); //we wanna see the geometry from req body
  
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing =new Listing(req.body.listing);
    newListing.owner = req.user._id; //new listing owner details, rpresent our owner id.
    newListing.image = {url,filename};

    newListing.geometry = response.body.features[0].geometry;// for our geometry part 

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.editForm =async (req,res)=>{
    let {id} = req.params; 
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Requested listing does not exist!");
        res.redirect("/listings");
     }
     let originalImageUrl = listing.image.url;
     originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_300");
    res.render("listings/edit.ejs", {listing,  originalImageUrl});
};

module.exports.updateListing =async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}); //deconstructing req.body.listing
    //basic code through which we can update at the time of updation
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`); //redirects on show route.
};

module.exports.destroyListing =async(req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};