import * as express from 'express'
import { MulterRequest } from '../config/types';
const multer = require("multer");
const router = require("express").Router();
const multerConfig = require("../config/multer");
const Photo = require("../models/Photo");

router.put("/:id", multer(multerConfig).single("file"), async (req:express.Request, res:express.Response) => {

    const { originalname: name, size, key, location: url = "" } = (req as unknown as MulterRequest).file;

    const pic = await Photo.create({
      name,
      size,
      key,
      url,
    });



});

module.exports = router;
