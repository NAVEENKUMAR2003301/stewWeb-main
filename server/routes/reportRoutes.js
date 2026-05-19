const router = require("express").Router();

const { sendMonthlyReport } = require("../controllers/reportController");

router.post("/send", sendMonthlyReport);

module.exports = router;
