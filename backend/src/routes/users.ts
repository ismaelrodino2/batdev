import * as express from "express";
import { MulterRequest, Posts } from "../config/types";
const router = require("express").Router();
const multer = require("multer");
const multerConfig = require("../config/multer");
const Photo = require("../models/Photo");
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS,
});

const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");


//UPDATE
router.put(
  "/",
  multer(multerConfig).single("file"),
  async (req: express.Request, res: express.Response) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET);
    const userId = decoded.id;


    if (userId) {
      let pic;

      if ((req as unknown as MulterRequest).file) {

        const user = await User.findById(userId);
        
        try {
          await s3
            .deleteObject({
              Bucket: process.env.BUCKET_NAME,
              Key: user.picKey,
            }).promise();
        } catch (err) {
          console.log(err);
        }


        const {
          originalname: name,
          size,
          key,
          location: url = "",
        } = (req as unknown as MulterRequest).file;

        pic = await Photo.create({
          name,
          size,
          key,
          url,
        });


      } // delete older pic from s3

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }

      try {

        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            $set: req.body,
            profilePic: pic?.url,
          },
          { new: true }
        );
        res.status(200).json(updatedUser);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You aren't logged in");
    }
  }
);

//DELETE
router.delete("/", async (req: express.Request, res: express.Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.SECRET);

  const user = await User.findById(decoded.id);
  const posts = await Post.find({username: user.username})

  const userId = decoded.id;

  if (userId) {
    try {
      const user = await User.findById(userId);
      try {
        await Post.deleteMany({ username: user.username }); //delete all posts
        await User.findByIdAndDelete(userId); //delete user

        posts.forEach(async(el:Posts) => {
          try {
            await s3
              .deleteObject({
                Bucket: process.env.BUCKET_NAME,
                Key: el.picKey,
              }).promise();
          } catch (err) {
            console.log(err);
          }
        }); //delete all images from posts



        try {
          await s3
            .deleteObject({
              Bucket: process.env.BUCKET_NAME,
              Key: user.picKey,
            }).promise();
        } catch (err) {
          console.log(err);
        }

        res.status(200).json("User has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      res.status(404).json("User not found!");
    }
  } else {
    res.status(401).json("You can delete only your account!");
  }
});

//GET/RECOVER USER INFO
router.get("", async (req: express.Request, res: express.Response) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET);

    const user = await User.findById(decoded.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
