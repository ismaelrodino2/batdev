import * as express from 'express'
import { MulterRequest } from '../config/types';
const router = require("express").Router();
const User = require("../models/User");
const Photo = require("../models/Photo");
const Post = require("../models/Post");
const Comments = require("../models/Comment");
const multer = require("multer");
const multerConfig = require("../config/multer");
const { response } = require("express");
var jwt = require("jsonwebtoken");
const AWS = require('aws-sdk')
const s3 = new AWS.S3({      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey:process.env.AWS_SECRET_ACCESS});
  
//UPDATE POST
  router.put("/:id", multer(multerConfig).single("file"), async (req:express.Request, res:express.Response) => {

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.SECRET);  
  const userId = decoded.id
  const post = await Post.findById(req.params.id);
  const body = req.body


  //add new pic delete old

  try {
    let pic

    if((req as unknown as MulterRequest).file){
      const { originalname: name, size, key, location: url = "" } = (req as unknown as MulterRequest).file;
  
      pic = await Photo.create({
        name,
        size,
        key,
        url,
      });
  
      const user = await User.findById(userId);

      await s3.deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: post.picKey //delete post's pic
      }).promise()
        
  
    }//delete older pic from s3


    if (post.user.toString() === userId) {
      try {
      
        

        if((req as unknown as MulterRequest).file){
          const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
              ...body,
              postPic: pic?.url
  
            },
            { new: true }
          );
          res.status(200).json(updatedPost);
        } else{

          const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
              $set: req.body,  
            },
            { new: true }
          );
          res.status(200).json(updatedPost);
        }
        
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE POST
router.delete("/:id", async (req:express.Request, res:express.Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.SECRET);  
  const userId = decoded.id
  const post = await Post.findById(req.params.id);
  const comments = await Comments.find({ post:req.params.id })

  try{
    try{  
      await s3.deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: post.picKey //delete post's pic
      }).promise()
    }catch(err){
      res.status(500).json({
        message:  's3',
        error: err});
    }
    
    if (post.user.toString() === userId) {
      try {
        await post.delete();
        if( comments.length === 0){
          console.log('no comments')
        }else{
          await comments.delete();
        }
        res.status(200).json({status:"Post has been deleted..."});
      } catch (err) {
        res.status(500).json({
          message:  'post error',
          error: err});
      }
    } else {
      res.status(401).json({
        error: "You can delete only your post!"});
    }
  }catch{
    res.status(401).json({
      error: "General error"});  }

});

//MY POSTS
router.get("/byauth", async (req:express.Request, res:express.Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.SECRET);  
  const user = await User.findById(decoded.id)
  const post = await Post.find({ username:user.username });

  try {
    res.send(post)
    
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;
