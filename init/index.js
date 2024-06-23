const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const Travel_url = "mongodb://127.0.0.1:27017/travelingfun";

main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(Travel_url);
}

//now we make a function 
const initDB = async()=>{ // if there is already data present then we delete it
    await Listing.deleteMany({}); //cleaning if data already present
    initData.data = initData.data.map((obj)=>({...obj, owner: "661d767e4d56cd2d478c8299"})); //adding owner property in our object
    Listing.insertMany(initData.data); //now adding our own data
    console.log("data was initialized");
};

initDB(); //calling function