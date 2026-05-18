const router = require("express").Router();
const Event = require("../models/Event"); // ← MUST be imported
const {
  createEvent,
  getAllEvents,
  getPastEvents,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { protect } = require("../middlewares/auth");

// ---------- PUBLIC ROUTES ----------

// GET /api/events/past
router.get("/past", getPastEvents);

// GET /api/events/upcoming
router.get("/upcoming", async (req, res) => {
  try {
    const events = await Event.find({ isPast: false }).sort({ date: 1 });
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/events/featured  ← NEW (for home page carousel)
router.get("/featured", async (req, res) => {
  try {
    const events = await Event.find({ isPast: true, featured: true })
      .sort({ date: -1 })
      .limit(10);
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/events/:id (single event, public)
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event)
      return res.status(404).json({ success: false, error: "Event not found" });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ---------- PROTECTED (ADMIN) ROUTES ----------

router.post("/", protect, createEvent);
router.get("/", protect, getAllEvents);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);

module.exports = router;
