const express = require("express");
const app = express();
const users = require("./route/user.js");
const posts = require("./route/post.js");
//const cookieParser = require("cookie-parser"); //requiring cookieParser
const session = require("express-session");//requiring session
const flash = require("connect-flash"); //requiring connect flash
const path = require("path");

//for views to show flash
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//better way to write so that in future we can add more options
const sessionOptions = {
    secret: "mycodeforexpresssession",
    resave: false,
    saveUninitialized: true};

app.use(session(sessionOptions));
app.use(flash()); //for connect flash

//by using middleware for messages
app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

//creating a new route
app.get("/register", (req,res)=>{
    let {name ="anonymous"} = req.query; //name will be given in query string form. ?name=abcd
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("error", "user not registered");
    }else{
        req.flash("success", "flash work registered perfect");//key and message pair(both in string).
    }
    res.redirect("/hello");
});

app.get("/hello", (req,res)=>{
    //a better way to access these messages ie.-> middleware
    // res.locals.successMsg = req.flash("success");
    // res.locals.errorMsg = req.flash("error");
    //console.log(req.flash(`success`)); test case
    //res.send(`hello, ${req.session.name} `);
    res.render("page.ejs", {name: req.session.name});
});


//app.use(
//   session({
//   secret: "mycodeforexpresssession",
//   resave: false,
//    saveUninitialized: true})); //another better way to do this

// app.get("/reqcount", (req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// });

// app.get("/test", (req,res)=>{
//     res.send("test success");
// });

//and to use cookieParser
// app.use(cookieParser("signedcode"));

// app.get("/getsignedcookie", (req,res)=>{
//     res.cookie("made-in", "India", {signed: true});
//     res.send("code sent");
// });

// app.get("/getcookies", (req,res)=>{
//     res.cookie("greet", "hello");
//     res.cookie("origin", "India");
//     res.send("sent you some cookies");
// });

// //and to verify our signed cookies
// app.get("/verify", (req,res)=>{
//     //console.log(req.cookies);// will only show unsigned cookies not signed cookies, so
//     console.log(req.signedCookies);
//     res.send("verified");
// });

// app.get("/greet", (req,res)=>{
//     let {name="anonymous"} = req.cookies;
//     res.send(`Hi, ${name}`);
// });

// app.get("/", (req,res)=>{
//     console.dir(req.cookies);
//     res.send("Root connected");
// });

// app.use("/users", users);
// app.use("/posts", posts);

app.listen(3000, ()=>{
    console.log("server listening to port 3000");
});