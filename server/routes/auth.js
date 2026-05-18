const router = require("express").Router();
const { login, logout, getMe } = require("../controllers/authController");
const { protect } = require("../middlewares/auth");

router.post("/login", login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

module.exports = router;
