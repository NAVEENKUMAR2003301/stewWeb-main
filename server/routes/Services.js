const router = require("express").Router();
const { protect } = require("../middlewares/auth");
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

// Public routes
router.get("/", getServices);
router.get("/:id", getService);

// Admin only
router.post("/", protect, createService);
router.put("/:id", protect, updateService);
router.delete("/:id", protect, deleteService);

module.exports = router;
