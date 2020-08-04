const express = require("express");
const app = express();
const port = 9000;
const mongoose = require("mongoose");
const env = require("dotenv").config();
const userRoute = require("./routes/User");
const connectUri = `mongodb+srv://admin:${process.env.PASSWORD}@${process.env.MONGOURL}/${process.env.DATABASE}?retryWrites=true&w=majority`;
const passport = require("./middleware/passportSetup.js");
const session = require("express-session");
const bodyParser = require("body-parser");
const auth = require("./routes/Auth");
const cors = require("cors");
const cookieSession = require("cookie-session");
const posts = require("./routes/Post");
const comments = require("./routes/Comment");
mongoose
  .connect(connectUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connect to mongo"))
  .catch((e) => console.log("error to connect"));
let db = mongoose.connection;
db.once("open", () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors({ credentials: true, origin: true }));
  app.use(
    cookieSession({
      name: "session",
      maxAge: 24 * 60 * 60 * 100,
      keys: ["key1"],
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.get("/", (req, res) => {
    res.send("Hello worlds");
  });
  app.use("/users", userRoute);
  app.use("/auth", auth);
  app.use("/post", posts);
  app.use("/comment", comments);
  app.listen(port, () => console.log("App work"));
});
module.exports = app;
