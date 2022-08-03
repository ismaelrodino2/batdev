const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const createPost = require("./routes/createPost");
const createUser = require("./routes/register");
const getPostRoute = require("./routes/getPosts");
const categoriesRoute = require("./routes/categories");
const createcategoriesRoute = require("./routes/createCat");
const getcomments = require("./routes/getcomments");
const comment = require("./routes/comment");
const multer = require("multer");
var jwt = require("jsonwebtoken");
const cors = require("cors");
import { Request, Response, NextFunction } from "express";

dotenv.config();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("conected to mongo"))
  .catch((err: any) => console.log(err));

function checkToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "Access denied!" });
  }

  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();
  } catch (err) {
    res.status(400).json({ msg: "Invalid token!" });
  }
}

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: any,
    cb: (arg0: null, arg1: string) => void
  ) => {
    cb(null, "images");
  },
  filename: (req: Request, file: any, cb: (arg0: null, arg1: any) => void) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post(
  "/api/uploads",
  upload.single("file"),
  (req: Request, res: Response) => {
    res.status(200).json("File has been uploaded");
  }
);

app.use("/api/auth", authRoute);
app.use("/api/users", checkToken, usersRoute);
app.use("/api/posts", checkToken, postRoute);
app.use("/api/getposts", getPostRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/createcategories", checkToken, createcategoriesRoute);
app.use("/api/getcomments", getcomments);
app.use("/api/comment", checkToken, comment);
app.use("/api/register", createUser);
app.use("/api/createposts", checkToken, createPost);

app.listen(process.env.PORT, () => {
  console.log("runing");
});
