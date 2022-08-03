import * as express from 'express'
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

//LOGIN
router.post("/login", async (req:express.Request, res:express.Response) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    const validate = await bcrypt.compare(req.body.password, user.password);

    if(!validate || !user){
      res.status(400).json("Wrong credentials!");
    }

    const { password, ...others } = user._doc;

    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    if (user && validate) {
      res.status(200).json({ token, info: others });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
