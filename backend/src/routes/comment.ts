import * as express from 'express'
import { CommentTypes } from "../models/Comment";

const router = require("express").Router();
const Comment = require("../models/Comment");
var jwt = require("jsonwebtoken");

router.post("/", async (req:express.Request, res:express.Response) => {
  
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.SECRET);  
  try {
    
      const newComment:CommentTypes = new Comment({...req.body, user:decoded.id});

      const comment = await newComment.save();

    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
