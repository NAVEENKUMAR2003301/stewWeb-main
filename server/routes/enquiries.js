const router = require("express").Router();
const {
  submitEnquiry,
  getEnquiries,
  updateEnquiry,
} = require("../controllers/enquiryController");
const { protect } = require("../middlewares/auth");

router.post("/", submitEnquiry); // public
router.get("/", protect, getEnquiries); // admin only
router.put("/:id", protect, updateEnquiry); // admin only

module.exports = router;
