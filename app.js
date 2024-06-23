//printing environment variable
if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}
// require('dotenv').config();
// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose =require("mongoose");
//const Listing = require("./models/listing.js");
const path = require("path");//for ejs
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
//const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
//const {listingSchema, reviewSchema} =require("./schema.js"); //only required, now to use it we go to create route
//const Review = require("./models/review.js");
const session = require("express-session"); //for express-session
const flash = require("connect-flash"); //requiring flash
//requiring passport
const LocalStrategy =require("passport-local"); //requiring local strategy
const User = require("./models/user.js"); //requiring userschema
const passport =require("passport"); //requiring passsport

const listingRouter = require("./routes/listing.js"); //it will crash coz we have'nt used wrapAsync & other middleware in listing.js
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//for database connection
const Travel_url = "mongodb://127.0.0.1:27017/travelingfun";
//const dbUrl =process.env.ATLASDB_URL;

main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(Travel_url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));  //so that data that comes in req can be parsed.
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate); //using ejs locals for all ejs templates.
app.use(express.static(path.join(__dirname, "/public")));

//Defining session options
const sessionOptions = {
    secret: "mysecretcodefortest",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //expires after a week ie 7 days/ 24 hours/60 minutes/60 seconds/1000 miliseconds
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, //for security purposes
    }
};

// app.get("/", (req,res)=>{
//     res.send("connected to root successfully");
// });

//session implemented first coz passport uses session.
app.use(session(sessionOptions));
app.use(flash()); //using flash, use this before the routes coz we are going to use flash with the help of routes.

//using passport here coz we need session to implement passport
app.use(passport.initialize()); //for every req our passport will initialize
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //user comes so they should authentiate through LocalStrategy, method use to authenticate user will be authenticate->added by passport-local-mongoose.

// using static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser()); //serialize users into the session
passport.deserializeUser(User.deserializeUser()); //deserialize users into the session

//creating a middleware for our flash
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");  
    res.locals.error = req.flash("error");  
    res.locals.currUser =req.user;
    next();
});

//creating demo user
// app.get("/demouser", async(req,res)=>{
//     let fakeUser = new User({
//         email: "student12@gmail.com",
//         username: "student-delta"
//     });
//     //register logic already implemented by passport
//     let registeredUser = await User.register(fakeUser, "hellostudent"); //user, password & we can send a callback too in register
//     res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.all("*", (req,res,next)=>{
    next(new ExpressError(404, "Page not found!"));
});

// For ExpressError
app.use((err, req, res, next)=>{
    let {status=500, message="Something went wrong!"} =err;        //deconsructing ExpressError
   res.status(status).render("error.ejs", {message});
    // res.status(status).send(message);
});


app.listen(8080, ()=>{
    console.log("Server listening on port: 8080");
});