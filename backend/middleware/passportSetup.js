const passport = require('passport')
var LocalStrategy  = require('passport-local').Strategy
const userModel = require('../models/User')

passport.serializeUser(function(user,done){
    done(null,user)
});
passport.deserializeUser(function (id,done) {
    userModel.findById(id,function (err,user) {
        done(err,user)
      })
  });
passport.use(new LocalStrategy({usernameField:"email",passwordField:"password"},
    function(email,password,done){
    userModel.findOne({email:email},function(err,user){
        if (err){
            return done(err);
        }
        if(!user){
            return done(null,false,{message:'Incorrect username'})
        }
        if(!user.validatePassword(password)){
            return done(null,false,{message:"Incorrect password"})
        }
        return done(null,user)
    })
}));
module.exports = passport