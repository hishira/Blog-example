const express = require("express");
const app = express();
const checkifAdmin = require("../middleware/ifadmin");
const checkIfLogin = require("../middleware/logedin");
const UserController = require('../controllers/UserController')
app.get("/users", checkifAdmin, UserController.GetAllUsers);
app.get("/adminuserinfo/:id", checkifAdmin, UserController.UserInfo);
app.get("/userinfo", checkIfLogin, UserController.UserWithPosts);
app.delete("/user/:id", checkifAdmin,UserController.Delete);
/*
    change user role to admin
*/
app.put("/rolechange/:id", checkifAdmin,UserController.ChangeUserRole);
/**
 * Email change
 */
app.put("/emailchange", checkIfLogin, UserController.EmailChange);
app.put("/descriptionchange", checkIfLogin, UserController.DescriptionChange);
app.put("/passwordchange", checkIfLogin, UserController.PasswordChange);
app.post("/userfind", UserController.UserFind);
app.get("/userpublicprofile/:id", UserController.GetUserPublicProfile);
app.post("/watchUser",UserController.WatchUser);
app.post("/unwatchUser", UserController.UnwatchUser);
app.put("/useredit/:id", checkifAdmin, UserController.Update);
app.post("/getwatchedusers",UserController.GetWatchedUsers)
module.exports = app;
