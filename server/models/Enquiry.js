const mongoose = require("mongoose");

// const enquirySchema = new mongoose.Schema({
//   name: String,
//   phone: { type: String, required: true },
//   eventType: String,
//   eventDate: Date,
//   city: String,
//   message: String,
//   preferredContact: {
//     type: String,
//     enum: ["whatsapp", "call"],
//     default: "whatsapp",
//   },
//   contacted: { type: Boolean, default: false },
//   notes: String,
//   createdAt: { type: Date, default: Date.now },
// });

const enquirySchema = new mongoose.Schema({
  name: String,
  phone: { type: String, required: true },
  email: String, // ← add this
  eventType: String,
  customEventType: String,
  eventDate: Date,
  city: String,
  message: String,
  preferredContact: {
    type: String,
    enum: ["whatsapp", "call"],
    default: "whatsapp",
  },
  contacted: { type: Boolean, default: false },
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Enquiry", enquirySchema);
