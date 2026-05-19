// const router = require("express").Router();
// const { protect } = require("../middlewares/auth");
// const {
//   getServices,
//   getService,
//   createService,
//   updateService,
//   deleteService,
// } = require("../controllers/serviceController");

// // Placeholder—replace with actual controller logic if needed
// router.get('/', (req, res) => {
//   res.json({ success: true, data: [] });
// });

// // Public routes
// router.get("/", getServices);
// router.get("/:id", getService);

// // Admin only
// router.post("/", protect, createService);
// router.put("/:id", protect, updateService);
// router.delete("/:id", protect, deleteService);

// module.exports = router;
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