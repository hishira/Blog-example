const express = require("express");
const app = express();
const passport = require("passport");
const checkIfAdmin = require("../middleware/ifadmin");
const checkIfLogin = require("../middleware/logedin");
const AuthController = require('../controllers/AuthController')
app.post("/login", passport.authenticate("local", { session: true }), AuthController.Login);
app.get("/logout", AuthController.Logout);
app.get("/checklogged",checkIfLogin,AuthController.IfLoged)
app.post("/register",AuthController.Register);
module.exports = app;
