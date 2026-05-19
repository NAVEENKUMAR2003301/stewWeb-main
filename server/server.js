// // const express = require("express");
// // const mongoose = require("mongoose");
// // const cors = require("cors");
// // const helmet = require("helmet");
// // const morgan = require("morgan");
// // const rateLimit = require("express-rate-limit");
// // const cookieParser = require("cookie-parser");
// // const cron = require("node-cron"); // ← for automatic monthly report
// // const servicesRoutes = require("./routes/services");
// // require("dotenv").config();

// // const app = express();
// // require("./cron/monthlyReportCronAutomation")

// // // ---------- Security ----------
// // app.use(helmet());
// // app.use(
// //   cors({
// //     origin: process.env.CLIENT_URL || "http://localhost:5173",
// //     credentials: true,
// //   }),
// // );
// // app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// // // ---------- Body parsers ----------
// // app.use(express.json());
// // app.use(cookieParser());

// // // ---------- Logger ----------
// // if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// // // ---------- Routes ----------
// // app.use("/api/auth", require("./routes/auth"));
// // app.use("/api/events", require("./routes/events"));
// // app.use("/api/enquiries", require("./routes/enquiries"));
// // app.use("/api/upload", require("./routes/upload"));
// // // app.use("/api/report", require("./routes/report"));
// // app.use("/api/services", servicesRoutes);
// // app.use("/api/admin", require("./routes/admin"));
// // app.use("/api/services", require("./routes/services"));
// // app.use("/api/contact", require("./routes/Contact"));

// // // ---------- 404 handler ----------
// // app.use((req, res) => {
// //   res.status(404).json({ success: false, error: "Route not found" });
// // });

// // // ---------- Error handler ----------
// // app.use(require("./middlewares/errorHandler"));

// // // ---------- Database & Start ----------
// // const PORT = process.env.PORT || 5000;

// // // Connection options to bypass TLS issues (local dev only)
// // const mongooseOptions = {
// //   tlsAllowInvalidCertificates: true, // ← fixes the SSL error
// //   // family: 4,                        // uncomment if you need IPv4
// // };

// // mongoose
// //   .connect(process.env.MONGO_URI, mongooseOptions)
// //   .then(() => {
// //     console.log("✅ MongoDB connected");
// //     app.listen(PORT, () => {
// //       console.log(`🚀 Server running on port ${PORT}`);
// //     });

// //     // -------- CRON JOB: monthly report at 00:00 on the 1st --------
// //     const { sendMonthlyReport } = require("./controllers/reportController");
// //     cron.schedule("0 0 1 * *", async () => {
// //       console.log("📧 Running monthly report cron...");
// //       try {
// //         const req = {};
// //         const res = {
// //           json: () => {},
// //           status: function () {
// //             return this;
// //           },
// //         };
// //         await sendMonthlyReport(req, res);
// //         console.log("✅ Monthly report sent successfully");
// //       } catch (err) {
// //         console.error("❌ Cron error:", err.message);
// //       }
// //     });
// //   })
// //   .catch((err) => {
// //     console.error("❌ MongoDB connection error:", err.message);
// //     process.exit(1);
// //   });

// // // Keep the process alive on unhandled rejections
// // process.on("unhandledRejection", (err) => {
// //   console.error("Unhandled Rejection:", err);
// // });

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

// // ---------- CRON ----------
// require("./cron/monthlyReportCronAutomation");

// // ---------- Security ----------
// app.use(helmet());

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:5173",
//     credentials: true,
//   }),
// );

// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//   }),
// );

// // ---------- Body Parser ----------
// app.use(express.json());
// app.use(cookieParser());

// // ---------- Logger ----------
// if (process.env.NODE_ENV !== "production") {
//   app.use(morgan("dev"));
// }

// // ---------- Routes ----------
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/events", require("./routes/events"));
// app.use("/api/enquiries", require("./routes/enquiries"));
// app.use("/api/upload", require("./routes/upload"));
// app.use("/api/admin", require("./routes/admin"));
// app.use("/api/contact", require("./routes/Contact"));

// // IMPORTANT
// app.use("/api/services", require("./routes/services"));

// // ---------- 404 ----------
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     error: "Route not found",
//   });
// });

// // ---------- Error Handler ----------
// app.use(require("./middlewares/errorHandler"));

// // ---------- Database ----------
// const PORT = process.env.PORT || 5000;

// mongoose
//   .connect(process.env.MONGO_URI, {
//     tlsAllowInvalidCertificates: true,
//   })
//   .then(() => {
//     console.log("✅ MongoDB connected");

//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });

//     // ---------- Monthly Report Cron ----------
//     const { sendMonthlyReport } = require("./controllers/reportController");

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

//         console.log("✅ Monthly report sent");
//       } catch (err) {
//         console.error("❌ Cron Error:", err.message);
//       }
//     });
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB Error:", err.message);
//     process.exit(1);
//   });

// // ---------- Unhandled Rejection ----------
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

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000 ,
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
// DATABASE
// ======================================

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    tlsAllowInvalidCertificates: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");

    // ======================================
    // SERVER START
    // ======================================

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
