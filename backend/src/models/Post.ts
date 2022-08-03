const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },

    desc: {
      type: String,
      required: true,
    },
    postPic: {
      type: String,
      default: "",
    },
    picKey: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      required: true,
    },
    user: { 
      type: mongoose.Schema.Types.String,
      ref: 'User',
      required: true 
    },
    categories: [{
      type: mongoose.Schema.Types.String, 
      ref: 'Category'
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
