const Event = require("../models/Event.js");
const Enquiry = require("../models/Enquiry.js");

exports.getDashboard = async (req, res) => {
  try {
    // ---------- Basic counts ----------
    const totalEvents = await Event.countDocuments();
    const pastEvents = await Event.countDocuments({ isPast: true });
    const totalEnquiries = await Enquiry.countDocuments();

    const firstDayOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );
    const newEnquiriesThisMonth = await Enquiry.countDocuments({
      createdAt: { $gte: firstDayOfMonth },
    });

    const stats = {
      totalEvents,
      pastEvents,
      totalEnquiries,
      newEnquiriesThisMonth,
    };

    // ---------- Recent enquiries (for table) ----------
    const recentEnquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("name phone eventType createdAt");

    // ---------- Chart data (last 6 months) ----------
    const months = [];
    const enquiryCounts = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthLabel = d.toLocaleString("default", { month: "short" });
      months.push(monthLabel);

      const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
      const lastDay = new Date(
        d.getFullYear(),
        d.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );

      const count = await Enquiry.countDocuments({
        createdAt: { $gte: firstDay, $lte: lastDay },
      });
      enquiryCounts.push(count);
    }

    const chart = {
      labels: months,
      datasets: [
        {
          label: "Enquiries",
          data: enquiryCounts,
          backgroundColor: "#b76e79",
          borderRadius: 6,
        },
      ],
    };

    // ---------- Single success response ----------
    res.json({
      success: true,
      stats,
      recentEnquiries,
      chart,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
