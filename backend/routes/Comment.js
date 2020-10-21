const express = require("express");

const app = express();
const checkIfAdmin = require("../middleware/ifadmin");
const checkIfLogin = require("../middleware/logedin");
const CommentController = require('../controllers/CommentController')
app.get("/comments", checkIfAdmin, CommentController.GetComments);
app.post("/annonymousCommment", CommentController.CreateAnonymousComment);
app.post("/comment", checkIfLogin,CommentController.CreateComment );
app.post("/commentforpost", CommentController.GetCommentsByPost);
app.delete("/comment/:id", checkIfLogin, CommentController.Delete);
app.put("/comment/:id", checkIfLogin,CommentController.Update);
app.post("/sortcomment",CommentController.Sort)
app.get("/usercomments/:id",checkIfAdmin,CommentController.GetUserComments)

module.exports = app;
