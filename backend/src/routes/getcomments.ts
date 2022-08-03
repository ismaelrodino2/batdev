import * as express from 'express'
const router = require("express").Router();
const Comment = require("../models/Comment");


router.get("/:id?", async (req:express.Request, res:express.Response) => {
  const post = req.params.id; 

  let comments;

    comments = await Comment.find({ post }).lean().populate("post", "username").populate("user", "profilePic"); 



  res.status(200).json(comments);
});

module.exports = router;
