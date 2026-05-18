const router = require("express").Router();
const { protect } = require("../middlewares/auth");
const { getDashboard } = require("../controllers/adminController");

router.get("/dashboard", protect, getDashboard);
module.exports = router;
