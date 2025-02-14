const { User, Article } = require("../model/model");
const bcrypt = require("bcrypt");

const userController = {
  // GET ALL USERS
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().populate("articles");
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET PUBLIC USERS
  getPublicUsers: async (req, res) => {
    try {
      const currentUser = req.user;

      // Nếu là admin
      if (currentUser.isAdmin) {
        const allUsers = await User.find(
          { _id: { $ne: currentUser._id } } // Loại trừ admin hiện tại
        );
        return res.status(200).json(allUsers);
      }

      // Nếu là user thường
      const publicUsers = await User.find(
        {
          _id: { $ne: currentUser._id }, // Loại trừ user hiện tại
          isAdmin: { $ne: true }, // Loại trừ các admin
        },
        {
          // Ẩn các trường nhạy cảm
          password: 0,
          username: 0,
          email: 0,
          refreshToken: 0,
          isAdmin: 0,
        }
      );

      res.status(200).json(publicUsers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // GET A USER
  getAUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate("articles");
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // PUT USER
  updateUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
      await user.updateOne({ $set: req.body });
      res.status(200).json("Cập nhập thành công");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // DELETE USER
  deleteUser: async (req, res) => {
    try {
      const articles = await Article.find({ writer: req.params.id });
      await Article.deleteMany({ writer: req.params.id });
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({
        message: "Xóa người dùng thành công",
        deletedArticles: articles,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = userController;
