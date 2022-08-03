import * as express from 'express'
import { MulterRequest } from '../config/types';
const Post = require("../models/Post");
const User = require("../models/User");
const multer = require("multer");
const router = require("express").Router();
const multerConfig = require("../config/multer");
const Photo = require("../models/Photo");
var jwt = require("jsonwebtoken");

router.post("/", multer(multerConfig).single("file"), async (req:express.Request, res:express.Response) => {

  const body = req.body

  const categories = JSON.parse(req.body.categories)

  if((req as unknown as MulterRequest).file){
    const { originalname: name, size, key, location: url = "" } = (req as unknown as MulterRequest).file;


    const pic = await Photo.create({
      name,
      size,
      key,
      url,
    });

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET);  
  
    const user = await User.findById(decoded.id);
    const username = user.username;
  
    const id =  decoded.id.toString()
    const newPost = new Post({
      ...body,
      user: id,
      username,
      categories,
      postPic: pic.url,
      picKey: pic.key
    });

    const post = await newPost.save();
  
    return res.json({ post });

  }else{


    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET);  
  
    const user = await User.findById(decoded.id);
    const username = user.username;
  

    const id =  decoded.id.toString()
    const newPost = new Post({
      ...body,
      user: id,
      username,
      categories,
    });

    const post = await newPost.save();
  
    return res.json({ post });
  }
 
});

module.exports = router;
