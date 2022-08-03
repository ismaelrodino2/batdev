import * as express from 'express'
const router = require("express").Router();
const Category = require("../models/Category");

//all categories

router.get("/", async (req:express.Request, res:express.Response) => {
  try {
    const cats = await Category.find();
    res.status(200).json(cats);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
