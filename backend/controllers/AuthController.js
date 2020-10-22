const userModel = require("../models/User");
function getUserPreview(user) {
  return {
    _id: user._id,
    email: user.email,
    username: user.username,
    role: user.role,
    watched: user.watched,
    posts: user.posts,
    comments: user.comments,
  };
}
class AuthController {
  static async Login(req, res) {
    return res.status(200).json({ user: getUserPreview(req.user) });
  }
  static async Logout(req, res) {
    req.logout();
    return res.status(200).json({ user: req.user });
  }
  static async IfLoged(req, res) {
    try {
      return res.status(200).json({ user: getUserPreview(req.user) });
    } catch (err) {
      return res.status(500).send("Server error");
    }
  }
  static async Register(req, res) {
    const userExists = await userModel.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(400).send({ message: "user with that email exists" });
    } else {
      try {
        const newUser = new userModel(req.body);
        try {
          await newUser.save();
          return res
            .status(200)
            .send({ id: newUser._id, email: newUser.email });
        } catch (error) {
          return res.status(500).send({ status: error });
        }
      } catch (e) {
        return res.status(500).json({ status: e._message });
      }
    }
  }
}
module.exports = AuthController;
