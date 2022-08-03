import * as express from 'express'
const router = require("express").Router();
const Post = require("../models/Post");

//GET POST

router.get("/:id", async (req:express.Request, res:express.Response) => {
  try {
    const post = await Post.findById(req.params.id).populate("categories");
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL POSTS
router.get("/", async (req:express.Request, res:express.Response) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username }).populate("categories"); 
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      }).populate("categories"); 
    } else {
      posts = await Post.find().populate("categories");
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL POSTS BY CAT OR USERNAME
router.get("/", async (req:express.Request, res:express.Response) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
