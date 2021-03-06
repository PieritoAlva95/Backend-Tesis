const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
    },
    text: {
      type: String,
      required: true,
    },
    names: {
      type: String,
    },
    lastNames: {
      type: String,
    },
    rating: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
)

const PostSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    names: {
      type: String,
    },
    lastNames: {
      type: String,
    },
    numComments: {
      type: Number,
      default: 0,
    },
    numLikes: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0.0,
    },
    category: {
      type: String,
      required: true,
    },
    likes: [
      {
        user: {
          type: Schema.Types.ObjectId,
        },
      },
    ],
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('post', PostSchema)
