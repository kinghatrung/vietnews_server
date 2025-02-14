const { Article, Genres } = require("../model/model");

const genreController = {
  // ADD GENRE
  addGenre: async (req, res) => {
    try {
      const newGenre = new Genres(req.body);
      const saveGenre = await newGenre.save();
      res.status(200).json(saveGenre);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET ALL GENRES
  addAllGenres: async (req, res) => {
    try {
      const genres = await Genres.find().populate({
        path: "articles",
        populate: {
          path: "author",
          select: "name nickname",
        },
      });
      res.status(200).json(genres);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET A GENRE
  getAGenre: async (req, res) => {
    try {
      const genre = await Genres.findById(req.params.id).populate({
        path: "articles",
        populate: {
          path: "author",
          select: "name nickname",
        },
      });
      res.status(200).json(genre);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // PUT GENRES
  updateGenre: async (req, res) => {
    try {
      const genre = await Genres.findById(req.params.id);
      await genre.updateOne({ $set: req.body });
      res.status(200).json("Cập nhập thành công");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // DELETE GENRE
  deleteGenre: async (req, res) => {
    try {
      await Article.updateMany(
        { genres: req.params.id },
        { $pull: { genres: req.params.id } }
      );
      await Genres.findByIdAndDelete(req.params.id);
      res.status(200).json("Xóa thành công");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = genreController;
