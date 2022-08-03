const router = require("express").Router();
const Category = require("../models/Category");
var jwt = require("jsonwebtoken");
import * as express from 'express'

//create category
router.post("/", async (req:express.Request, res:express.Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.SECRET);  

  const newCat = new Category({
    ...req.body,
    user: decoded.id
  });

  try {
    const savedCategory = await newCat.save();
    res.status(200).json(savedCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
