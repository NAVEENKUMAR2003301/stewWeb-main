const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary (using your .env variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Memory storage – file will be in buffer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Helper: upload buffer to Cloudinary and return secure_url
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "wedding_planner",
        transformation: [
          { width: 1200, quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      },
    );
    uploadStream.end(buffer);
  });
};

// Middleware for single file upload
exports.uploadSingle = (req, res, next) => {
  const singleUpload = upload.single("image");
  singleUpload(req, res, async (err) => {
    if (err)
      return res.status(400).json({ success: false, error: err.message });
    try {
      if (req.file) {
        const url = await uploadToCloudinary(req.file.buffer);
        req.file.path = url; // so the route handler can use req.file.path
      }
      next();
    } catch (error) {
      res.status(500).json({ success: false, error: "Upload failed" });
    }
  });
};

// Middleware for multiple file uploads
exports.uploadMultiple = (req, res, next) => {
  const multiUpload = upload.array("images", 10);
  multiUpload(req, res, async (err) => {
    if (err)
      return res.status(400).json({ success: false, error: err.message });
    try {
      if (req.files && req.files.length > 0) {
        const urls = await Promise.all(
          req.files.map((file) => uploadToCloudinary(file.buffer)),
        );
        req.files = urls; // pass the array of URLs
      }
      next();
    } catch (error) {
      res.status(500).json({ success: false, error: "Upload failed" });
    }
  });
};

// Also export the raw multer instance if needed elsewhere
exports.upload = upload;
