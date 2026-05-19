// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const rateLimit = require("express-rate-limit");
// const cookieParser = require("cookie-parser");
// const cron = require("node-cron");

// require("dotenv").config();

// const app = express();

// // ======================================
// // CRON FILE
// // ======================================

// require("./cron/monthlyReportCronAutomation.js");

// // ======================================
// // SECURITY
// // ======================================

// app.use(helmet());

// app.use(
//   cors({
//     origin:"https://stew-web-main.vercel.app",
//     credentials: true,
//   }),
// );

// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//   }),
// );

// // ======================================
// // BODY PARSER
// // ======================================

// app.use(express.json());
// app.use(cookieParser());

// // ======================================
// // LOGGER
// // ======================================

// if (process.env.NODE_ENV !== "production") {
//   app.use(morgan("dev"));
// }

// // ======================================
// // ROUTES
// // ======================================

// app.get("/", (req, res) => {
//   res.status(200).json({ message: "API Running...!" });
// });

// app.use("/api/auth", require("./routes/auth.js"));

// app.use("/api/events", require("./routes/events.js"));

// app.use("/api/enquiries", require("./routes/enquiries.js"));

// app.use("/api/upload", require("./routes/upload.js"));

// app.use("/api/admin", require("./routes/admin.js"));

// app.use("/api/contact", require("./routes/Contact.js"));

// app.use("/api/services", require("./routes/services.js"));

// app.use("/api/report", require("./routes/reportRoutes.js"));

// // ======================================
// // 404 ROUTE
// // ======================================

// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     error: "Route not found",
//   });
// });

// // ======================================
// // ERROR HANDLER
// // ======================================

// app.use(require("./middlewares/errorHandler.js"));

// // ======================================
// // DATABASE
// // ======================================

// const PORT = process.env.PORT || 5000;

// mongoose
//   .connect(process.env.MONGO_URI, {
//     tlsAllowInvalidCertificates: true,
//   })
//   .then(() => {
//     console.log("✅ MongoDB connected");

//     // ======================================
//     // SERVER START
//     // ======================================

//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });

//     // ======================================
//     // MONTHLY REPORT CRON
//     // Every 1st day of month at 12:00 AM
//     // ======================================

//     const { sendMonthlyReport } = require("./controllers/reportController.js");

//     cron.schedule("0 0 1 * *", async () => {
//       console.log("📧 Running monthly report cron...");

//       try {
//         const req = {};

//         const res = {
//           json: () => {},
//           status: function () {
//             return this;
//           },
//         };

//         await sendMonthlyReport(req, res);

//         console.log("✅ Monthly report sent successfully");
//       } catch (err) {
//         console.error("❌ Cron Error:", err.message);
//       }
//     });
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB Error:", err.message);
//     process.exit(1);
//   });

// // ======================================
// // UNHANDLED REJECTION
// // ======================================

// process.on("unhandledRejection", (err) => {
//   console.error("Unhandled Rejection:", err);
// });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");

require("dotenv").config();

const app = express();

// ======================================
// CRON FILE
// ======================================

require("./cron/monthlyReportCronAutomation.js");

// ======================================
// SECURITY
// ======================================

app.use(helmet());

// ======================================
// CORS
// ======================================

const allowedOrigins = [
  "https://stew-web-main.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// ======================================
// RATE LIMITER
// ======================================

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);

// ======================================
// BODY PARSER
// ======================================

app.use(express.json());
app.use(cookieParser());

// ======================================
// LOGGER
// ======================================

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ======================================
// ROUTES
// ======================================

app.get("/", (req, res) => {
  res.status(200).json({ message: "API Running...!" });
});

app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/events", require("./routes/events.js"));
app.use("/api/enquiries", require("./routes/enquiries.js"));
app.use("/api/upload", require("./routes/upload.js"));
app.use("/api/admin", require("./routes/admin.js"));
app.use("/api/contact", require("./routes/Contact.js"));
app.use("/api/services", require("./routes/services.js"));
app.use("/api/report", require("./routes/reportRoutes.js"));

// ======================================
// 404 ROUTE
// ======================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// ======================================
// ERROR HANDLER
// ======================================

app.use(require("./middlewares/errorHandler.js"));

// ======================================
// DATABASE + SERVER START
// ======================================

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    tlsAllowInvalidCertificates: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // ======================================
    // MONTHLY REPORT CRON
    // Every 1st day of month at 12:00 AM
    // ======================================

    const { sendMonthlyReport } = require("./controllers/reportController.js");

    cron.schedule("0 0 1 * *", async () => {
      console.log("📧 Running monthly report cron...");

      try {
        const req = {};
        const res = {
          json: () => {},
          status: function () {
            return this;
          },
        };

        await sendMonthlyReport(req, res);
        console.log("✅ Monthly report sent successfully");
      } catch (err) {
        console.error("❌ Cron Error:", err.message);
      }
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

// ======================================
// UNHANDLED REJECTION
// ======================================

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});