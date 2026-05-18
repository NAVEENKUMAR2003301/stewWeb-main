// const Enquiry = require("../models/Enquiry");
// const Event = require("../models/Event");
// const sendEmail = require("../utils/sendEmail");

// exports.sendMonthlyReport = async (req, res) => {
//   try {
//     // ======================================
//     // DATE RANGE
//     // Example:
//     // May 1  -> Apr 1 to May 1
//     // May 5  -> Apr 5 to May 5
//     // ======================================

//     const now = new Date();

//     const startDate = new Date(now);
//     startDate.setMonth(now.getMonth() - 1);

//     const endDate = new Date(now);

//     // ======================================
//     // FETCH DATA
//     // ======================================

//     const enquiries = await Enquiry.find({
//       createdAt: {
//         $gte: startDate,
//         $lte: endDate,
//       },
//     }).sort({ createdAt: -1 });

//     const events = await Event.find({
//       createdAt: {
//         $gte: startDate,
//         $lte: endDate,
//       },
//     }).sort({ createdAt: -1 });

//     // ======================================
//     // STATS
//     // ======================================

//     const enquiriesCount = enquiries.length;
//     const eventsCount = events.length;

//     const contactedEnquiries = enquiries.filter(
//       (e) => e.contacted
//     ).length;

//     const pendingEnquiries = enquiries.filter(
//       (e) => !e.contacted
//     ).length;

//     const featuredEvents = events.filter(
//       (e) => e.featured
//     ).length;

//     const pastEvents = events.filter(
//       (e) => e.isPast
//     ).length;

//     // ======================================
//     // DATE LABELS
//     // ======================================

//     const startLabel = startDate.toLocaleDateString("en-IN", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });

//     const endLabel = endDate.toLocaleDateString("en-IN", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });

//     // ======================================
//     // SUBJECT
//     // ======================================

//     const adminSubject = `📊 Wedding Planner Report | ${startLabel} - ${endLabel}`;

//     // ======================================
//     // ENQUIRIES TABLE
//     // ======================================

//     const enquiriesTable = enquiries.length
//       ? enquiries
//           .map(
//             (enquiry) => `
//               <tr>
//                 <td style="padding:14px;border-bottom:1px solid #2b2b2b;color:#d7d7d7;">
//                   ${enquiry.name || "—"}
//                 </td>

//                 <td style="padding:14px;border-bottom:1px solid #2b2b2b;color:#d7d7d7;">
//                   ${enquiry.phone || "—"}
//                 </td>

//                 <td style="padding:14px;border-bottom:1px solid #2b2b2b;color:#d7d7d7;">
//                   ${enquiry.eventType || "—"}
//                 </td>

//                 <td style="padding:14px;border-bottom:1px solid #2b2b2b;color:#d7d7d7;">
//                   ${enquiry.city || "—"}
//                 </td>

//                 <td style="padding:14px;border-bottom:1px solid #2b2b2b;color:#d7d7d7;">
//                   ${
//                     enquiry.createdAt
//                       ? new Date(enquiry.createdAt).toLocaleDateString()
//                       : "—"
//                   }
//                 </td>
//               </tr>
//             `
//           )
//           .join("")
//       : `
//           <tr>
//             <td colspan="5" style="padding:18px;text-align:center;color:#8f8f8f;">
//               No enquiries during this period
//             </td>
//           </tr>
//         `;

//     // ======================================
//     // EVENTS TABLE
//     // ======================================

//     const eventsTable = events.length
//       ? events
//           .map(
//             (event) => `
//               <tr>
//                 <td style="padding:14px;border-bottom:1px solid #2b2b2b;color:#d7d7d7;">
//                   ${event.title || "—"}
//                 </td>

//                 <td style="padding:14px;border-bottom:1px solid #2b2b2b;color:#d7d7d7;">
//                   ${event.category || "—"}
//                 </td>

//                 <td style="padding:14px;border-bottom:1px solid #2b2b2b;color:#d7d7d7;">
//                   ${event.venue || "—"}
//                 </td>

//                 <td style="padding:14px;border-bottom:1px solid #2b2b2b;color:#d7d7d7;">
//                   ${
//                     event.date
//                       ? new Date(event.date).toLocaleDateString()
//                       : "—"
//                   }
//                 </td>

//                 <td style="padding:14px;border-bottom:1px solid #2b2b2b;color:#d7d7d7;">
//                   ${
//                     event.createdAt
//                       ? new Date(event.createdAt).toLocaleDateString()
//                       : "—"
//                   }
//                 </td>
//               </tr>
//             `
//           )
//           .join("")
//       : `
//           <tr>
//             <td colspan="5" style="padding:18px;text-align:center;color:#8f8f8f;">
//               No events during this period
//             </td>
//           </tr>
//         `;

//     // ======================================
//     // EMAIL HTML
//     // ======================================

//     const adminHtml = `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
// </head>

// <body style="
//   margin:0;
//   padding:0;
//   background:#0f0f0f;
//   font-family:Arial, Helvetica, sans-serif;
// ">

//   <table width="100%" cellpadding="0" cellspacing="0" border="0"
//     style="background:#0f0f0f;padding:40px 16px;">
//     <tr>
//       <td align="center">

//         <table width="100%" cellpadding="0" cellspacing="0" border="0"
//           style="
//             max-width:900px;
//             background:#161616;
//             border:1px solid #2b2b2b;
//             border-radius:24px;
//             overflow:hidden;
//           "
//         >

//           <!-- Top Bar -->
//           <tr>
//             <td style="
//               height:5px;
//               background:linear-gradient(90deg,#c8a96b,#f6e7b2,#c8a96b);
//             "></td>
//           </tr>

//           <!-- Header -->
//           <tr>
//             <td align="center" style="padding:48px 30px 24px;">

//               <h1 style="
//                 margin:0;
//                 color:#f6e7b2;
//                 font-size:34px;
//                 font-weight:700;
//               ">
//                 Wedding Planner Report
//               </h1>

//               <p style="
//                 margin-top:12px;
//                 color:#9d9d9d;
//                 font-size:15px;
//                 line-height:1.8;
//               ">
//                 ${startLabel} — ${endLabel}
//               </p>

//             </td>
//           </tr>

//           <!-- Stats -->
//           <tr>
//             <td style="padding:0 30px 30px;">

//               <table width="100%" cellpadding="0" cellspacing="0" border="0">

//                 <tr>

//                   <td width="33%" style="padding:10px;">
//                     <div style="
//                       background:#1d1d1d;
//                       border:1px solid #2b2b2b;
//                       border-radius:18px;
//                       padding:24px;
//                     ">
//                       <p style="margin:0;color:#8f8f8f;font-size:12px;text-transform:uppercase;">
//                         Enquiries
//                       </p>

//                       <h2 style="
//                         margin:12px 0 0;
//                         color:#f6e7b2;
//                         font-size:38px;
//                       ">
//                         ${enquiriesCount}
//                       </h2>
//                     </div>
//                   </td>

//                   <td width="33%" style="padding:10px;">
//                     <div style="
//                       background:#1d1d1d;
//                       border:1px solid #2b2b2b;
//                       border-radius:18px;
//                       padding:24px;
//                     ">
//                       <p style="margin:0;color:#8f8f8f;font-size:12px;text-transform:uppercase;">
//                         Events
//                       </p>

//                       <h2 style="
//                         margin:12px 0 0;
//                         color:#f6e7b2;
//                         font-size:38px;
//                       ">
//                         ${eventsCount}
//                       </h2>
//                     </div>
//                   </td>

//                   <td width="33%" style="padding:10px;">
//                     <div style="
//                       background:#1d1d1d;
//                       border:1px solid #2b2b2b;
//                       border-radius:18px;
//                       padding:24px;
//                     ">
//                       <p style="margin:0;color:#8f8f8f;font-size:12px;text-transform:uppercase;">
//                         Pending
//                       </p>

//                       <h2 style="
//                         margin:12px 0 0;
//                         color:#f6e7b2;
//                         font-size:38px;
//                       ">
//                         ${pendingEnquiries}
//                       </h2>
//                     </div>
//                   </td>

//                 </tr>

//                 <tr>

//                   <td width="33%" style="padding:10px;">
//                     <div style="
//                       background:#1d1d1d;
//                       border:1px solid #2b2b2b;
//                       border-radius:18px;
//                       padding:24px;
//                     ">
//                       <p style="margin:0;color:#8f8f8f;font-size:12px;text-transform:uppercase;">
//                         Contacted
//                       </p>

//                       <h2 style="
//                         margin:12px 0 0;
//                         color:#f6e7b2;
//                         font-size:38px;
//                       ">
//                         ${contactedEnquiries}
//                       </h2>
//                     </div>
//                   </td>

//                   <td width="33%" style="padding:10px;">
//                     <div style="
//                       background:#1d1d1d;
//                       border:1px solid #2b2b2b;
//                       border-radius:18px;
//                       padding:24px;
//                     ">
//                       <p style="margin:0;color:#8f8f8f;font-size:12px;text-transform:uppercase;">
//                         Featured Events
//                       </p>

//                       <h2 style="
//                         margin:12px 0 0;
//                         color:#f6e7b2;
//                         font-size:38px;
//                       ">
//                         ${featuredEvents}
//                       </h2>
//                     </div>
//                   </td>

//                   <td width="33%" style="padding:10px;">
//                     <div style="
//                       background:#1d1d1d;
//                       border:1px solid #2b2b2b;
//                       border-radius:18px;
//                       padding:24px;
//                     ">
//                       <p style="margin:0;color:#8f8f8f;font-size:12px;text-transform:uppercase;">
//                         Past Events
//                       </p>

//                       <h2 style="
//                         margin:12px 0 0;
//                         color:#f6e7b2;
//                         font-size:38px;
//                       ">
//                         ${pastEvents}
//                       </h2>
//                     </div>
//                   </td>

//                 </tr>

//               </table>

//             </td>
//           </tr>

//           <!-- Enquiries -->
//           <tr>
//             <td style="padding:0 30px 30px;">

//               <h2 style="
//                 color:#f6e7b2;
//                 margin-bottom:18px;
//                 font-size:24px;
//               ">
//                 Enquiries
//               </h2>

//               <div style="overflow-x:auto;">

//                 <table width="100%" cellpadding="0" cellspacing="0" border="0"
//                   style="
//                     background:#1d1d1d;
//                     border:1px solid #2b2b2b;
//                     border-radius:18px;
//                     overflow:hidden;
//                     min-width:700px;
//                   "
//                 >

//                   <tr style="background:#202020;">
//                     <th style="padding:16px;color:#f6e7b2;text-align:left;">Name</th>
//                     <th style="padding:16px;color:#f6e7b2;text-align:left;">Phone</th>
//                     <th style="padding:16px;color:#f6e7b2;text-align:left;">Event</th>
//                     <th style="padding:16px;color:#f6e7b2;text-align:left;">City</th>
//                     <th style="padding:16px;color:#f6e7b2;text-align:left;">Created</th>
//                   </tr>

//                   ${enquiriesTable}

//                 </table>

//               </div>

//             </td>
//           </tr>

//           <!-- Events -->
//           <tr>
//             <td style="padding:0 30px 40px;">

//               <h2 style="
//                 color:#f6e7b2;
//                 margin-bottom:18px;
//                 font-size:24px;
//               ">
//                 Events
//               </h2>

//               <div style="overflow-x:auto;">

//                 <table width="100%" cellpadding="0" cellspacing="0" border="0"
//                   style="
//                     background:#1d1d1d;
//                     border:1px solid #2b2b2b;
//                     border-radius:18px;
//                     overflow:hidden;
//                     min-width:700px;
//                   "
//                 >

//                   <tr style="background:#202020;">
//                     <th style="padding:16px;color:#f6e7b2;text-align:left;">Title</th>
//                     <th style="padding:16px;color:#f6e7b2;text-align:left;">Category</th>
//                     <th style="padding:16px;color:#f6e7b2;text-align:left;">Venue</th>
//                     <th style="padding:16px;color:#f6e7b2;text-align:left;">Event Date</th>
//                     <th style="padding:16px;color:#f6e7b2;text-align:left;">Created</th>
//                   </tr>

//                   ${eventsTable}

//                 </table>

//               </div>

//             </td>
//           </tr>

//           <!-- Footer -->
//           <tr>
//             <td align="center" style="
//               padding:30px;
//               border-top:1px solid #2b2b2b;
//             ">

//               <p style="
//                 margin:0 0 10px;
//                 color:#f6e7b2;
//                 font-size:16px;
//                 font-weight:600;
//               ">
//                 Wedding Planner Analytics
//               </p>

//               <p style="
//                 margin:0;
//                 color:#8f8f8f;
//                 font-size:13px;
//                 line-height:1.7;
//               ">
//                 Automatically generated monthly business report.
//               </p>

//             </td>
//           </tr>

//         </table>

//       </td>
//     </tr>
//   </table>

// </body>
// </html>
// `;

//     // ======================================
//     // SEND EMAIL
//     // ======================================

//     await sendEmail(
//       "Wedding Planner",
//       "leoseedan3@gmail.com",
//       adminSubject,
//       adminHtml
//     );

//     // ======================================
//     // RESPONSE
//     // ======================================

//     res.json({
//       success: true,
//       message: "Monthly report sent successfully.",
//       stats: {
//         enquiriesCount,
//         eventsCount,
//         contactedEnquiries,
//         pendingEnquiries,
//         featuredEvents,
//         pastEvents,
//       },
//     });

//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

const Enquiry = require("../models/Enquiry");
const Event = require("../models/Event");
const sendEmail = require("../utils/sendEmail");

exports.sendMonthlyReport = async (req, res) => {
  try {
    // ======================================
    // DATE RANGE
    // Example:
    // June 1 -> May 1 to June 1
    // ======================================

    const now = new Date();

    const startDate = new Date(now);
    startDate.setMonth(now.getMonth() - 1);

    const endDate = new Date(now);

    // ======================================
    // FETCH DATA
    // ======================================

    const enquiries = await Enquiry.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ createdAt: -1 });

    const events = await Event.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ createdAt: -1 });

    // ======================================
    // STATS
    // ======================================

    const enquiriesCount = enquiries.length;
    const eventsCount = events.length;

    const contactedEnquiries = enquiries.filter((e) => e.contacted).length;

    const pendingEnquiries = enquiries.filter((e) => !e.contacted).length;

    const featuredEvents = events.filter((e) => e.featured).length;

    const pastEvents = events.filter((e) => e.isPast).length;

    // ======================================
    // DATE LABELS
    // ======================================

    const startLabel = startDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const endLabel = endDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // ======================================
    // SUBJECT
    // ======================================

    const adminSubject = `📊 Wedding Planner Report | ${startLabel} - ${endLabel}`;

    // ======================================
    // ENQUIRIES TABLE
    // ======================================

    const enquiriesTable = enquiries.length
      ? enquiries
          .map(
            (enquiry) => `
              <tr>
                <td style="padding:14px;border-bottom:1px solid #2b2b2b;color:#d7d7d7;">
                  ${enquiry.name || "—"}
                </td>

                <td style="padding:14px;border-bottom:1px solid #2b2b2b;color:#d7d7d7;">
                  ${enquiry.phone || "—"}
                </td>

                <td style="padding:14px;border-bottom:1px solid #2b2b2b;color:#d7d7d7;">
                  ${enquiry.eventType || "—"}
                </td>

                <td style="padding:14px;border-bottom:1px solid #2b2b2b;color:#d7d7d7;">
                  ${enquiry.city || "—"}
                </td>

                <td style="padding:14px;border-bottom:1px solid #2b2b2b;color:#d7d7d7;">
                  ${
                    enquiry.createdAt
                      ? new Date(enquiry.createdAt).toLocaleDateString()
                      : "—"
                  }
                </td>
              </tr>
            `,
          )
          .join("")
      : `
          <tr>
            <td colspan="5" style="padding:18px;text-align:center;color:#8f8f8f;">
              No enquiries during this period
            </td>
          </tr>
        `;

    // ======================================
    // EVENTS TABLE
    // ======================================

    const eventsTable = events.length
      ? events
          .map(
            (event) => `
              <tr>
                <td style="padding:14px;border-bottom:1px solid #2b2b2b;color:#d7d7d7;">
                  ${event.title || "—"}
                </td>

                <td style="padding:14px;border-bottom:1px solid #2b2b2b;color:#d7d7d7;">
                  ${event.category || "—"}
                </td>

                <td style="padding:14px;border-bottom:1px solid #2b2b2b;color:#d7d7d7;">
                  ${event.venue || "—"}
                </td>

                <td style="padding:14px;border-bottom:1px solid #2b2b2b;color:#d7d7d7;">
                  ${
                    event.date ? new Date(event.date).toLocaleDateString() : "—"
                  }
                </td>

                <td style="padding:14px;border-bottom:1px solid #2b2b2b;color:#d7d7d7;">
                  ${
                    event.createdAt
                      ? new Date(event.createdAt).toLocaleDateString()
                      : "—"
                  }
                </td>
              </tr>
            `,
          )
          .join("")
      : `
          <tr>
            <td colspan="5" style="padding:18px;text-align:center;color:#8f8f8f;">
              No events during this period
            </td>
          </tr>
        `;

    // ======================================
    // EMAIL HTML
    // ======================================

    const adminHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>

<body style="
  margin:0;
  padding:0;
  background:#0f0f0f;
  font-family:Arial, Helvetica, sans-serif;
">

  <table width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background:#0f0f0f;padding:40px 16px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" border="0"
          style="
            max-width:900px;
            background:#161616;
            border:1px solid #2b2b2b;
            border-radius:24px;
            overflow:hidden;
          "
        >

          <!-- Header -->
          <tr>
            <td align="center" style="padding:48px 30px 24px;">

              <h1 style="
                margin:0;
                color:#f6e7b2;
                font-size:34px;
              ">
                Wedding Planner Report
              </h1>

              <p style="
                margin-top:12px;
                color:#9d9d9d;
                font-size:15px;
              ">
                ${startLabel} — ${endLabel}
              </p>

            </td>
          </tr>

          <!-- Stats -->
          <tr>
            <td style="padding:0 30px 30px;">

              <table width="100%" cellpadding="0" cellspacing="0" border="0">

                <tr>

                  <td style="padding:10px;">
                    <div style="
                      background:#1d1d1d;
                      border:1px solid #2b2b2b;
                      border-radius:18px;
                      padding:24px;
                    ">
                      <p style="margin:0;color:#8f8f8f;">
                        Enquiries
                      </p>

                      <h2 style="
                        margin:12px 0 0;
                        color:#f6e7b2;
                        font-size:38px;
                      ">
                        ${enquiriesCount}
                      </h2>
                    </div>
                  </td>

                  <td style="padding:10px;">
                    <div style="
                      background:#1d1d1d;
                      border:1px solid #2b2b2b;
                      border-radius:18px;
                      padding:24px;
                    ">
                      <p style="margin:0;color:#8f8f8f;">
                        Events
                      </p>

                      <h2 style="
                        margin:12px 0 0;
                        color:#f6e7b2;
                        font-size:38px;
                      ">
                        ${eventsCount}
                      </h2>
                    </div>
                  </td>

                </tr>

              </table>

            </td>
          </tr>

          <!-- Enquiries -->
          <tr>
            <td style="padding:0 30px 30px;">

              <h2 style="
                color:#f6e7b2;
                margin-bottom:18px;
              ">
                Enquiries
              </h2>

              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="
                  background:#1d1d1d;
                  border:1px solid #2b2b2b;
                "
              >

                <tr style="background:#202020;">
                  <th style="padding:16px;color:#f6e7b2;text-align:left;">Name</th>
                  <th style="padding:16px;color:#f6e7b2;text-align:left;">Phone</th>
                  <th style="padding:16px;color:#f6e7b2;text-align:left;">Event</th>
                  <th style="padding:16px;color:#f6e7b2;text-align:left;">City</th>
                  <th style="padding:16px;color:#f6e7b2;text-align:left;">Created</th>
                </tr>

                ${enquiriesTable}

              </table>

            </td>
          </tr>

          <!-- Events -->
          <tr>
            <td style="padding:0 30px 40px;">

              <h2 style="
                color:#f6e7b2;
                margin-bottom:18px;
              ">
                Events
              </h2>

              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="
                  background:#1d1d1d;
                  border:1px solid #2b2b2b;
                "
              >

                <tr style="background:#202020;">
                  <th style="padding:16px;color:#f6e7b2;text-align:left;">Title</th>
                  <th style="padding:16px;color:#f6e7b2;text-align:left;">Category</th>
                  <th style="padding:16px;color:#f6e7b2;text-align:left;">Venue</th>
                  <th style="padding:16px;color:#f6e7b2;text-align:left;">Event Date</th>
                  <th style="padding:16px;color:#f6e7b2;text-align:left;">Created</th>
                </tr>

                ${eventsTable}

              </table>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

    // ======================================
    // SEND EMAIL
    // ======================================

    await sendEmail(
      "Wedding Planner",
      "leoseedan3@gmail.com",
      adminSubject,
      adminHtml,
    );

    // ======================================
    // DELETE OLD DATA
    // Example:
    // June -> delete March and older
    // ======================================

    const deleteBeforeDate = new Date();

    // Go back 2 months
    deleteBeforeDate.setMonth(deleteBeforeDate.getMonth() - 2);

    // Set first date of month
    deleteBeforeDate.setDate(1);

    // Set time to 00:00
    deleteBeforeDate.setHours(0, 0, 0, 0);

    // ======================================
    // DELETE OLD ENQUIRIES
    // ======================================

    const deletedEnquiries = await Enquiry.deleteMany({
      createdAt: {
        $lt: deleteBeforeDate,
      },
    });

    // ======================================
    // DELETE OLD EVENTS
    // ======================================

    const deletedEvents = await Event.deleteMany({
      createdAt: {
        $lt: deleteBeforeDate,
      },
    });

    console.log("Deleted Enquiries:", deletedEnquiries.deletedCount);

    console.log("Deleted Events:", deletedEvents.deletedCount);

    // ======================================
    // RESPONSE
    // ======================================

    res.json({
      success: true,
      message: "Monthly report sent successfully.",

      deleted: {
        enquiries: deletedEnquiries.deletedCount,
        events: deletedEvents.deletedCount,
      },

      stats: {
        enquiriesCount,
        eventsCount,
        contactedEnquiries,
        pendingEnquiries,
        featuredEvents,
        pastEvents,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};