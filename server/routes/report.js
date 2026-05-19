const router = require("express").Router();
const { sendMonthlyReport } = require("../controllers/reportController.js");
const { protect } = require("../middlewares/auth.js");

router.post("/send", sendMonthlyReport);

module.exports = router;
