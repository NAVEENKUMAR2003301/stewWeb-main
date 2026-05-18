const router = require("express").Router();
const { sendMonthlyReport } = require("../controllers/reportController");
const { protect } = require("../middlewares/auth");

router.post("/send", sendMonthlyReport);

module.exports = router;
