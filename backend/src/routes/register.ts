const multer = require("multer");
const router = require("express").Router();
const multerConfig = require("../config/multer");
const Photo = require("../models/Photo");
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.post(
  "/",
  multer(multerConfig).single("file"),
  async (req: any, res: any) => {

    const body = req.body
    if(req.file){
      const {
        originalname: name,
        size,
        key,
        location: url = "",
      } = req.file;
  
      const pic = await Photo.create({
        name,
        size,
        key,
        url,
      });
  
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(body.password, salt);
  
      const newUser = new User({
        username: body.username,
        email: body.email,
        password: hashedPass,
        profilePic: pic.url,
        picKey: pic.key,
      });
  
      const user = await newUser.save();
  
      return res.json({ user });
    }else{
  
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(body.password, salt);
  
      const newUser = new User({
        username: body.username,
        email: body.email,
        password: hashedPass,
      });
  
      const user = await newUser.save();
  
      return res.json({ user });
    }

   
  }
);

module.exports = router;
