const User = require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.signup = async(req,res)=>{ //async coz change in database will happen
    try{
    let{username, email, password} = req.body;
    const newUser = new User({email, username}); //creating new user & passing email & username in it.
    const registeredUser = await User.register(newUser, password); 
    console.log(registeredUser);
    req.login(registeredUser, (err)=>{
        if(err){
            return next();
        }
        req.flash("success", "Welcome to Travelingfun");
        res.redirect("/listings");
    });
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome back to Travelingfun");
    // res.redirect(res.locals.redirectUrl); will show error coz it's empty
    let redirectUrl= res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){ //if error comes
            return next(err);
        }
        req.flash("success", "You are logged out now");
        res.redirect("/listings");
    });
};