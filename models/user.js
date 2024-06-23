const mongoose = require("mongoose");
const Schema =mongoose.Schema;
const passportLocalMongoose =require("passport-local-mongoose"); //requiring passportLocalMongoose

//Defining Schema now
const userSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    // username:{
    //     type: String,
    //     required:true
    // },
    // password:{
    //     type: Number,
    //     required:true
    // }  username & password by default already defined by passportLocalMongoose even if we mention it or not.
});

//passing passportLocalMongoose in user as plugin
userSchema.plugin(passportLocalMongoose); //coz automatically implement username, hashing, salting & hash password

//exporting userSchema
module.exports = mongoose.model('User', userSchema);