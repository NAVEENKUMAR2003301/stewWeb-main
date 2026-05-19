const router = require("express").Router();
const { login, logout, getMe } = require("../controllers/authController.js");
const { protect } = require("../middlewares/auth.js");

router.post("/login", login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

module.exports = router;
