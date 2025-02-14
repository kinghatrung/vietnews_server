const mongoose = require("mongoose");

// Author
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 24,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
    },
    name: {
      type: String,
    },
    nickname: {
      type: String,
    },
    address: { type: String },
    avatar: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    articles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
  },
  { timestamps: true }
);

// Bài báo
const articleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    subDescription: { type: String, required: true },
    image: { type: String },
    genres: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genres" }],
    writer: { type: mongoose.Schema.Types.ObjectId, ref: "Writer" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

// Thể loại
const genreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  articles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
});

const Article = mongoose.model("Article", articleSchema);
const Genres = mongoose.model("Genres", genreSchema);
const User = mongoose.model("User", userSchema);

module.exports = { Article, Genres, User };
