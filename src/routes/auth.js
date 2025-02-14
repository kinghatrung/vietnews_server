const router = require("express").Router();
const authController = require("../app/controllers/authController");
const middlewareController = require("../app/controllers/middlewareController");

// POST USER
router.post("/register", authController.registerUser);

// LOGIN USER
router.post("/login", authController.loginUser);

// REFRESH
router.post("/refresh", authController.requestRefreshToken);

// LOGOUT
router.post(
  "/logout",
  middlewareController.verifyToken,
  authController.userLogout
);

module.exports = router;
