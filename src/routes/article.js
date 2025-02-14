const router = require("express").Router();
const articleController = require("../app/controllers/articleController");

//ADD ARTICLE
router.post("/", articleController.addAArticle);

//GET ALL ARTICLE
router.get("/", articleController.getAllArticle);

//GET A ARTICLE
router.get("/:id", articleController.getArticle);

//UPDATE A ARTICLE
router.put("/:id", articleController.updateArticle);

// DELETE A ARTICLE
router.delete("/:id", articleController.deleteArticle);

// SEARCH ARTICLE
router.get("/search", articleController.searchArticle);

module.exports = router;
