const router = require("express").Router();

const { sendMonthlyReport } = require("../controllers/reportController.js");

router.post("/send", sendMonthlyReport);

module.exports = router;
