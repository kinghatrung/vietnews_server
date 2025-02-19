const { Article, Genres, User } = require("../model/model");

const articleController = {
  // ADD A ARTICLE
  addAArticle: async (req, res) => {
    try {
      const newArticle = new Article(req.body);
      const savedArticle = await newArticle.save();
      if (req.body.author) {
        const author = await User.findById(req.body.author);
        await author.updateOne({ $push: { articles: savedArticle._id } });
      }
      if (req.body.genres) {
        const genres = await Genres.findById(req.body.genres);
        await genres.updateOne({ $push: { articles: savedArticle._id } });
      }
      res.status(200).json(savedArticle);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET ALL ARTICLES
  getAllArticle: async (req, res) => {
    try {
      const allArticle = await Article.find().populate("genres writer author");
      res.status(200).json(allArticle);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET A ARTICLE
  getArticle: async (req, res) => {
    try {
      const article = await Article.findById(req.params.id).populate(
        "genres writer author"
      );
      res.status(200).json(article);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // PUT A ARTICLE
  updateArticle: async (req, res) => {
    try {
      const article = await Article.findById(req.params.id);

      if (req.body.author && req.body.author !== article.author.toString()) {
        const oldAuthor = await User.findById(article.author);
        const newAuthor = await User.findById(req.body.author);
        if (oldAuthor) {
          await oldAuthor.updateOne({ $pull: { articles: article._id } });
        }
        if (newAuthor) {
          await newAuthor.updateOne({ $push: { articles: article._id } });
        }
      }

      if (req.body.genres && req.body.genres !== article.genres.toString()) {
        const oldGenres = await Genres.findById(article.genres);
        const newGenres = await Genres.findById(req.body.genres);
        if (oldGenres) {
          await oldGenres.updateOne({ $pull: { articles: article._id } });
        }
        if (newGenres) {
          await newGenres.updateOne({ $push: { articles: article._id } });
        }
      }

      await article.updateOne({ $set: req.body });
      res.status(200).json("Cập nhập thành công");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // DELETE A ARTICLE
  deleteArticle: async (req, res) => {
    try {
      const article = await Article.findById(req.params.id);
      if (article.genres) {
        const genres = await Genres.findById(article.genres);
        if (genres) {
          await genres.updateOne({ $pull: { articles: article._id } });
        }
      }
      if (article.author) {
        const author = await User.findById(article.author);
        if (author) {
          await author.updateOne({ $pull: { articles: article._id } });
        }
      }
      await Article.findByIdAndDelete(req.params.id);
      res.status(200).json("Xóa thành công");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // SEARCH ARTICLE
  searchArticle: async (req, res) => {
    try {
      const { query } = req.query;
      if (!query) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
      }

      const searchQuery = {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { subDescription: { $regex: query, $options: "i" } },
        ],
      };

      const articles = await Article.find(searchQuery);
      res.status(200).json(articles);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = articleController;
