// // cron/monthlyReportCron.js

// const cron = require("node-cron");
// const { sendMonthlyReport } = require("../controllers/reportController");

// // Runs at 12:00 AM on the 1st day of every month
// cron.schedule("0 0 1 * *", async () => {

//   console.log("📊 Running monthly report job...");

//   try {
//     // mock req/res
//     const req = {};

//     const res = {
//       json: (data) => console.log("✅ Report sent:", data),

//       status: (code) => ({
//         json: (data) =>
//           console.error(`❌ Error ${code}:`, data),
//       }),
//     };

//     await sendMonthlyReport(req, res);

//   } catch (error) {
//     console.error("❌ Monthly report failed:", error);
//   }
// });

// cron/monthlyReportCron.js

const cron = require("node-cron");
const { sendMonthlyReport } = require("../controllers/reportController.js");

// Runs at 12:00 AM on the 1st day of every month
cron.schedule("0 0 1 * *", async () => {
  console.log("📊 Running monthly report job...");

  try {
    // mock req/res
    const req = {};

    const res = {
      json: (data) => console.log("✅ Report sent:", data),

      status: (code) => ({
        json: (data) =>
          console.error(`❌ Error ${code}:`, data),
      }),
    };

    await sendMonthlyReport(req, res);

  } catch (error) {
    console.error("❌ Monthly report failed:", error);
  }
});