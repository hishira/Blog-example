const express = require("express");
const router = express.Router();

router.use(function (req, res, next) {
  if (!req.user) {
    return res.status(400).send("Do not log in").end();
  }else if (req.user.role !== "ADMIN") {
    return res.status(400).send("Wrong role").end();
  }
  next();
});

module.exports = router;
