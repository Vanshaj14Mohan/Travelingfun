const mongoose = require("mongoose");
const Schema =mongoose.Schema;
const Review = require("./review.js"); 

//creating schema now
const listingSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description: String,
    image:{
        url:String,
        filename:String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    // coordinates:{
    //     type: [Number],
    //     required: true,
    // } but a better way to save our coordinates ie-> geojson
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          },
    },
});

listingSchema.post = ("findOneAndDelete", async(listing) => {
    if (listing) {
        await Review.deleteMany({_id : {$in: listing.reviews}})
    }
});

//now creating a model using this schema
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing; //to export it.


//  type: String,
//        default: 
//         "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fwallpapers%2Fnature%2Fsky&psig=AOvVaw2LhI-m3e14Ds5JUOUK8uzq&ust=1708859991957000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCLCL-tztw4QDFQAAAAAdAAAAABAD",
//        set: (v)=> 
//         v === ""? "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fwallpapers%2Fnature%2Fsky&psig=AOvVaw2LhI-m3e14Ds5JUOUK8uzq&ust=1708859991957000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCLCL-tztw4QDFQAAAAAdAAAAABAD" 
//         :v,