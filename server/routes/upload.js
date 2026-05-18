const router = require("express").Router();
const { protect } = require("../middlewares/auth");
const { uploadSingle, uploadMultiple } = require("../middlewares/upload");

// Single image
router.post("/single", protect, uploadSingle, (req, res) => {
  if (!req.file)
    return res.status(400).json({ success: false, error: "No file" });
  res.json({ success: true, url: req.file.path });
});

// Multiple images
router.post("/multiple", protect, uploadMultiple, (req, res) => {
  if (!req.files || req.files.length === 0)
    return res.status(400).json({ success: false, error: "No files" });
  res.json({ success: true, urls: req.files });
});

module.exports = router;
