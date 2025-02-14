const router = require("express").Router();
const genreController = require("../app/controllers/genreController");

//ADD GENRES
router.post("/", genreController.addGenre);

//GET ALL GENRE
router.get("/", genreController.addAllGenres);

//GET A GENRE
router.get("/:id", genreController.getAGenre);

//UPDATE GENRE
router.put("/:id", genreController.updateGenre);

//DELETE GENRE
router.delete("/:id", genreController.deleteGenre);

module.exports = router;
