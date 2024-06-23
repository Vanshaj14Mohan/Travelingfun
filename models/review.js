const mongoose = require("mongoose");
const Schema =mongoose.Schema;

//creating review schema
const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    //not using this rn, will use it in latest stages.
    createdAt:{
        type: Date,
        default: Date.now() //current date set ho jaaye random,
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

//Exporting Model now
module.exports = mongoose.model("Review", reviewSchema);

