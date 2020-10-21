const express = require("express");
const PostController = require('../controllers/PostController');
const app = express();
const checkifAdmin = require("../middleware/ifadmin");
const checkifLogin = require("../middleware/logedin");

app.get("/posts", checkifAdmin, PostController.GetAllPosts);
/*
  Return only public posts
*/
app.get("/publicposts", checkifLogin,PostController.GetPublicPosts);
/*
  Return all private post, for admin only
*/
app.get("/privateposts", checkifAdmin,PostController.GetPrivatePosts);
/* 
  Return all, private and public user posts
*/
app.get("/userposts", checkifLogin, PostController.GetUserPosts);
/*
  Return public post by id
*/
app.get("/publicuserpost/:id", PostController.GetPublicUserPosts);
app.post("/post", checkifLogin, PostController.Create);

/*
  Edit post by id
*/
app.put("/post/:id",checkifLogin, PostController.Update);

/* 
    Function that make post private
*/
app.put("/postprivate/:id", checkifLogin,PostController.MakePrivate);

/* 
    Function that make post public
*/
app.put("/publicpost/:id",checkifLogin, PostController.MakePublic);
app.delete("/post/:id", checkifLogin,PostController.Delete);
app.post("/post/likeadd/:id",checkifLogin,PostController.Like);
app.post("/post/likeremove/:id",checkifLogin,PostController.RemoveLike);
app.post("/sortpost",PostController.Sort);
app.get("/userposts/:id",checkifAdmin,PostController.UserPosts);
app.post("/sortpostsbylikes",PostController.SortByLikes);
app.post("/getpostsbytag",PostController.PostsByTag);
module.exports = app;
