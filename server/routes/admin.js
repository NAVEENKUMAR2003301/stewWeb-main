const router = require("express").Router();
const { protect } = require("../middlewares/auth.js");
const { getDashboard } = require("../controllers/adminController.js");

router.get("/dashboard", protect, getDashboard);
module.exports = router;
