
const mongoose = require("mongoose");

export type CommentTypes = {
  save?: any;
  text: string;
  user: object;
  post: object;
  userName: string;
  profilePic: string;
}

const CommentSchema:CommentTypes = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true 
    },
    post: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Post',
      required: true
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model("Comment", CommentSchema);
