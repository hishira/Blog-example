const userModel = require("../models/User");
const User = require("../models/User");

class UserController {
  static async GetAllUsers(req, res) {
    try {
      const users = await userModel.find({}).catch((err) => {
        res.status(404).send("Database error");
      });
      try {
        res.status(200).send(users).end();
      } catch (err) {
        res.status(400).send(err).end();
      }
    } catch (err) {
      res.status(500).json({ message: "Database error" });
    }
  }
  static async UserInfo(req, res) {
    try {
      const user = await userModel.findById(req.params.id);
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).send("Server error");
    }
  }
  static async UserWithPosts(req, res) {
    try {
      const user = await User.findById(req.user._id);
      await user.populate("posts").execPopulate();
      try {
        return res
          .status(200)
          .json({
            email: user.email,
            username: user.username,
            role: user.role,
            description: user.description,
            posts: user.posts,
            comments: user.comments,
            watched: user.watched,
            _id: user._id,
          })
          .end();
      } catch (err) {
        return res.status(400).json(err).end();
      }
    } catch (err) {
      return res.status(500).json(err).end();
    }
  }
  static async Delete(req, res) {
    try {
      const user = await userModel.findByIdAndDelete(req.params.id);
      if (!user) {
        res.status(404).send("Not user found");
      }
      res.status(200).send("OK");
    } catch (err) {
      res.status(500).send(err);
    }
  }
  static async ChangeUserRole(req, res) {
    try {
      userModel.findOneAndUpdate(
        { _id: req.params.id },
        { role: "ADMIN" },
        { new: true },
        (err, model) => {
          if (err) {
            return res
              .status(404)
              .json({ message: "Erorro with user role updating" });
          } else {
            if (model === null)
              return res.status(404).json({ message: "No user" });
            return res.status(200).json(model);
          }
        }
      );
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
  static async EmailChange(req, res) {
    try {
      let userExists = await userModel.findOne({ email: req.body.email });
      if (userExists)
        return res.status(404).json({ message: "Email is already taken" });
      userModel.findByIdAndUpdate(
        req.user._id,
        {
          email: req.body.email,
        },
        (err, model) => {
          if (err) {
            res.status(404).json({ message: "Erorro with user role updating" });
          } else {
            res.status(200).json({ obj: model });
          }
        }
      );
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
  static async DescriptionChange(req, res) {
    try {
      userModel.findByIdAndUpdate(
        req.user._id,
        { description: req.body.description },
        { new: true },
        (err, model) => {
          if (err) {
            return res.status(404).json({ message: "Problem" });
          } else if (model === null) {
            return res.status(404).json({ message: "Problem" });
          }
          return res.status(200).json(model);
        }
      );
    } catch (err) {
      return res.status(500).send(err);
    }
  }
  static async PasswordChange(req, res) {
    try {
      userModel.findOne({ _id: req.user._id }, (err, user) => {
        if (err) {
          return res.status(404).send("Password change problem");
        }
        user.password = req.body.password;
        user.save();
        res.status(200).send("Ok");
      });
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
  static async UserFind(req, res) {
    try {
      let users = await userModel.find({
        username: { $regex: req.body.username, $options: "i" },
      });
      res.status(200).json(users).end();
    } catch (err) {
      res.status(500).json(err).end();
    }
  }
  static async GetUserPublicProfile(req, res) {
    try {
      let user = await userModel.findById(req.params.id);
      await user
        .populate({ path: "posts", match: { postType: "PUBLIC" } })
        .execPopulate();
      if (!user) return res.status(404).send("UserNotFound").end();
      return res.status(200).json(user).end();
    } catch (err) {
      return res.status(500).send("Server erroor");
    }
  }
  static async WatchUser(req, res) {
    try {
      let user = await userModel.findById(req.user._id);
      if (user.watched.includes(req.body.userID)) {
        console.log("TAK");
        return res.status(200).json(user);
      }
      user.watched.push(req.body.userID);
      await user.save();
      return res.status(200).json(user).end();
    } catch (err) {
      return res.status(500).send("Server error").end();
    }
  }
  static async UnwatchUser(req, res) {
    try {
      let user = await userModel.findById(req.user._id);
      let id = user.watched.indexOf(req.body.userID);
      if (id > -1) {
        user.watched.splice(id, 1);
        await user.save();
        return res.status(200).json(user);
      }
      return res.status(404).send("Do not watch by user");
    } catch (err) {
      return res.status(500).send("Server error");
    }
  }
  static async Update(req,res){
    try {
        if (req.body.password !== "") {
          let user = await userModel.findById(req.params.id);
          user.email = req.body.email;
          user.username = req.body.username;
          user.role = req.body.role;
          user.description = req.body.description;
          user.password = req.body.password;
          await user.save();
          return res.status(200).json(user);
        } else {
          userModel.findByIdAndUpdate(
            req.params.id,
            { 
              email:req.body.email,
              username:req.body.username,
              role:req.body.role,
              description: req.body.description 
            },
            { new: true },
            (err, model) => {
              if (err) {
                return res.status(404).json({ message: "Problem" });
              } else if (model === null) {
                return res.status(404).json({ message: "Problem" });
              }
              return res.status(200).json(model);
            }
          );
        }
      } catch (err) {
        return res.status(500).send(err);
      }
  }
  static async GetWatchedUsers(req,res){
    try{
        const user = await userModel.findById(req.body.userID);
        await user.populate("watched").execPopulate();
        return res.status(200).json(user);
      }catch(err){
        return res.status(500).send("Server error");
      }  
  }
}
module.exports = UserController;
