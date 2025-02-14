const router = require("express").Router();
const middlewareController = require("../app/controllers/middlewareController");
const userController = require("../app/controllers/userController");

// GET ALL USERS
router.get("/", middlewareController.verifyToken, userController.getAllUsers);

// GET PUBLIC USERS
router.get(
  "/publicusers",
  middlewareController.authMiddleware,
  userController.getPublicUsers
);

//GET A USER
router.get("/:id", userController.getAUser);

//PUT USER
router.put("/:id", middlewareController.verifyToken, userController.updateUser);

// DELETE USER
router.delete(
  "/:id",
  middlewareController.verifyTokenAndAdminAuth,
  userController.deleteUser
);

module.exports = router;
