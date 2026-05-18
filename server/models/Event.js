const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  venue: String,
  category: {
    type: String,
    enum: ["wedding", "reception", "corporate", "birthday", "other"],
  },
  isPast: { type: Boolean, default: false },
  coverImage: String,
  gallery: [String], // Cloudinary URLs
  videoLink: String,
  featured: { type: Boolean, default: false },
  clientName: String,
  clientTestimonial: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Event", eventSchema);
