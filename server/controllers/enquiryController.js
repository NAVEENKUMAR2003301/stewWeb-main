// const Enquiry = require("../models/Enquiry");
// const sendEmail = require("../utils/sendEmail");

// const email = process.env.ADMIN_EMAIL

// // Submit enquiry (public)
// exports.submitEnquiry = async (req, res) => {
//   try {
//     const enquiry = await Enquiry.create(req.body);
//     // ---- Build email content for admin ----
//     const adminSubject = `New Enquiry from ${enquiry.name || "Unknown"} - ${enquiry.eventType || "Event"}`;
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

//   <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f0f0f; padding:40px 16px;">
//     <tr>
//       <td align="center">

//         <table width="100%" cellpadding="0" cellspacing="0" border="0"
//           style="
//             max-width:650px;
//             background:#161616;
//             border:1px solid #2b2b2b;
//             border-radius:24px;
//             overflow:hidden;
//           "
//         >

//           <!-- Premium Gold Top -->
//           <tr>
//             <td style="
//               height:5px;
//               background:linear-gradient(90deg,#c8a96b,#f6e7b2,#c8a96b);
//             "></td>
//           </tr>

//           <!-- Header -->
//           <tr>
//             <td align="center" style="padding:42px 30px 24px;">

//               <h1 style="
//                 margin:0;
//                 color:#f6e7b2;
//                 font-size:32px;
//                 font-weight:700;
//                 letter-spacing:1px;
//               ">
//                 New Enquiry Received
//               </h1>

//               <p style="
//                 margin-top:12px;
//                 color:#9d9d9d;
//                 font-size:14px;
//                 line-height:1.7;
//               ">
//                 A new premium event enquiry has been submitted from the website.
//               </p>

//             </td>
//           </tr>

//           <!-- Content -->
//           <tr>
//             <td style="padding:0 30px 40px;">

//               <div style="
//                 background:#1d1d1d;
//                 border:1px solid #2e2e2e;
//                 border-radius:18px;
//                 overflow:hidden;
//               ">

//                 <!-- Table -->
//                 <table width="100%" cellpadding="0" cellspacing="0" border="0">

//                   ${[
//         ["Name", enquiry.name || "—"],
//         ["Phone", enquiry.phone || "—"],
//         ["Email", enquiry.email || "—"],
//         ["Event Type", enquiry.eventType || "—"],
//         [
//           "Event Date",
//           enquiry.eventDate
//             ? new Date(enquiry.eventDate).toLocaleDateString()
//             : "—"
//         ],
//         ["City", enquiry.city || "—"],
//         ["Message", enquiry.message || "—"],
//       ]
//         .map(
//           ([label, value]) => `
//                       <tr>
//                         <td style="
//                           padding:18px 20px;
//                           border-bottom:1px solid #2a2a2a;
//                           width:180px;
//                           color:#f6e7b2;
//                           font-size:14px;
//                           font-weight:700;
//                           vertical-align:top;
//                         ">
//                           ${label}
//                         </td>

//                         <td style="
//                           padding:18px 20px;
//                           border-bottom:1px solid #2a2a2a;
//                           color:#d7d7d7;
//                           font-size:14px;
//                           line-height:1.8;
//                           word-break:break-word;
//                         ">
//                           ${value}
//                         </td>
//                       </tr>
//                     `
//         )
//         .join("")}

//                 </table>

//               </div>

//             </td>
//           </tr>

//           <!-- Footer -->
//           <tr>
//             <td align="center" style="
//               padding:28px 24px 40px;
//               border-top:1px solid #2a2a2a;
//             ">

//               <a
//                 href="mailto:${enquiry.email || ""}"
//                 style="
//                   display:inline-block;
//                   margin-bottom:14px;
//                   padding:14px 26px;
//                   background:linear-gradient(135deg,#c8a96b,#f6e7b2);
//                   color:#111111;
//                   text-decoration:none;
//                   font-size:14px;
//                   font-weight:700;
//                   border-radius:12px;
//                   letter-spacing:0.4px;
//                 "
//               >
//                 Reply to Customer
//               </a>

//               <p style="
//                 margin:0;
//                 color:#8f8f8f;
//                 font-size:13px;
//                 line-height:1.7;
//               ">
//                 You can contact the customer directly via email or WhatsApp for further discussion.
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

//     // Send admin notification (asynchronously – don't block response)
//     await sendEmail(email, email, adminSubject, adminHtml).catch((err) =>
//       console.error("Failed to send admin email:", err),
//     );

//     // ---- Send thank-you email to user if email provided ----
//     if (enquiry.email) {
//       const userSubject = `Thank you for your enquiry, ${enquiry.name || "Valued Customer"}!`;
//       const userHtml = `
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

//   <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f0f0f; padding:40px 16px;">
//     <tr>
//       <td align="center">

//         <table width="100%" cellpadding="0" cellspacing="0" border="0"
//           style="
//             max-width:620px;
//             background:#161616;
//             border:1px solid #2a2a2a;
//             border-radius:24px;
//             overflow:hidden;
//           "
//         >

//           <!-- Top Gold Line -->
//           <tr>
//             <td style="
//               height:5px;
//               background:linear-gradient(90deg,#c8a96b,#f6e7b2,#c8a96b);
//             "></td>
//           </tr>

//           <!-- Header -->
//           <tr>
//             <td align="center" style="padding:50px 30px 24px;">
//               <h1 style="
//                 margin:0;
//                 color:#f6e7b2;
//                 font-size:34px;
//                 font-weight:700;
//                 letter-spacing:1px;
//               ">
//                 Wedding Planner
//               </h1>

//               <p style="
//                 margin-top:12px;
//                 color:#b5b5b5;
//                 font-size:15px;
//                 line-height:1.7;
//               ">
//                 Luxury Events • Elegant Experiences • Timeless Celebrations
//               </p>
//             </td>
//           </tr>

//           <!-- Content -->
//           <tr>
//             <td style="padding:0 30px 40px;">

//               <div style="
//                 background:#1d1d1d;
//                 border:1px solid #2e2e2e;
//                 border-radius:18px;
//                 padding:32px;
//               ">

//                 <p style="
//                   margin:0 0 18px;
//                   color:#ffffff;
//                   font-size:18px;
//                   font-weight:600;
//                 ">
//                   Dear ${enquiry.name || "Customer"},
//                 </p>

//                 <p style="
//                   margin:0 0 18px;
//                   color:#d0d0d0;
//                   font-size:15px;
//                   line-height:1.9;
//                 ">
//                   Thank you for reaching out to us regarding your
//                   <strong style="color:#f6e7b2;">
//                     ${enquiry.eventType || "event"}
//                   </strong>.
//                 </p>

//                 <p style="
//                   margin:0 0 28px;
//                   color:#d0d0d0;
//                   font-size:15px;
//                   line-height:1.9;
//                 ">
//                   We’ve successfully received your enquiry and our team will contact you shortly to discuss your vision in detail.
//                 </p>

//                 <!-- CTA -->
//                 <table cellpadding="0" cellspacing="0" border="0">
//                   <tr>
//                     <td align="center">
//                       <a
//                         href="https://wa.me/${process.env.WHATSAPP_NUMBER || "919876543210"}"
//                         style="
//                           display:inline-block;
//                           padding:15px 28px;
//                           background:linear-gradient(135deg,#c8a96b,#f6e7b2);
//                           color:#111111;
//                           text-decoration:none;
//                           font-size:15px;
//                           font-weight:700;
//                           border-radius:12px;
//                           letter-spacing:0.5px;
//                         "
//                       >
//                         Chat on WhatsApp
//                       </a>
//                     </td>
//                   </tr>
//                 </table>

//               </div>

//             </td>
//           </tr>

//           <!-- Footer -->
//           <tr>
//             <td align="center" style="
//               padding:28px 20px 40px;
//               border-top:1px solid #2a2a2a;
//             ">

//               <p style="
//                 margin:0 0 10px;
//                 color:#f6e7b2;
//                 font-size:16px;
//                 font-weight:600;
//               ">
//                 EventPlanner Team
//               </p>

//               <p style="
//                 margin:0;
//                 color:#8f8f8f;
//                 font-size:13px;
//                 line-height:1.7;
//               ">
//                 Crafting unforgettable luxury celebrations with elegance and perfection.
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
//       await sendEmail(email, enquiry.email, userSubject, userHtml).catch((err) =>
//         console.error("Failed to send user email:", err),
//       );
//     }

//     res.status(201).json({ success: true, data: enquiry });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Get all enquiries (admin)
// exports.getEnquiries = async (req, res) => {
//   try {
//     const enquiries = await Enquiry.find().sort({ createdAt: -1 });
//     res.json({ success: true, data: enquiries });
//   } catch (error) {
//     res.status(500).json({ success: false, error });
//   }
// };

// // Update enquiry (mark contacted, add note)
// exports.updateEnquiry = async (req, res) => {
//   try {
//     const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     res.json({ success: true, data: enquiry });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };


const Enquiry = require("../models/Enquiry");
const sendEmail = require("../utils/sendEmail");

const email = process.env.ADMIN_EMAIL;

// Submit enquiry (public)
exports.submitEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);

    // ---- Admin email ----
    const adminSubject = `New Enquiry from ${enquiry.name || "Unknown"} - ${enquiry.eventType || "Event"}`;
    const adminHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    /* Mobile responsive */
    @media only screen and (max-width: 600px) {
      .main-table {
        width: 100% !important;
      }
      .content-padding {
        padding-left: 16px !important;
        padding-right: 16px !important;
      }
      .label-cell {
        display: block !important;
        width: 100% !important;
        padding-bottom: 4px !important;
        border-bottom: none !important;
      }
      .value-cell {
        display: block !important;
        width: 100% !important;
        padding-top: 0 !important;
        border-bottom: 1px solid #2a2a2a !important;
        padding-bottom: 16px !important;
      }
      .button {
        width: 100% !important;
        text-align: center !important;
      }
    }
  </style>
</head>

<body style="
  margin:0;
  padding:0;
  background:#0f0f0f;
  font-family:Arial, Helvetica, sans-serif;
">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f0f0f; padding:40px 16px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" border="0" class="main-table"
          style="
            max-width:650px;
            background:#161616;
            border:1px solid #2b2b2b;
            border-radius:24px;
            overflow:hidden;
          "
        >

          <!-- Premium Gold Top -->
          <tr>
            <td style="
              height:5px;
              background:linear-gradient(90deg,#c8a96b,#f6e7b2,#c8a96b);
            "></td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding:42px 30px 24px;" class="content-padding">

              <h1 style="
                margin:0;
                color:#f6e7b2;
                font-size:32px;
                font-weight:700;
                letter-spacing:1px;
              ">
                New Enquiry Received
              </h1>

              <p style="
                margin-top:12px;
                color:#9d9d9d;
                font-size:14px;
                line-height:1.7;
              ">
                A new premium event enquiry has been submitted from the website.
              </p>

            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:0 30px 40px;" class="content-padding">

              <div style="
                background:#1d1d1d;
                border:1px solid #2e2e2e;
                border-radius:18px;
                overflow:hidden;
              ">

                <!-- Table -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0">

                  ${[
                    ["Name", enquiry.name || "—"],
                    ["Phone", enquiry.phone || "—"],
                    ["Email", enquiry.email || "—"],
                    ["Event Type", enquiry.eventType || "—"],
                    [
                      "Event Date",
                      enquiry.eventDate
                        ? new Date(enquiry.eventDate).toLocaleDateString()
                        : "—",
                    ],
                    ["City", enquiry.city || "—"],
                    ["Message", enquiry.message || "—"],
                  ]
                    .map(
                      ([label, value]) => `
                      <tr>
                        <td class="label-cell" style="
                          padding:18px 20px;
                          border-bottom:1px solid #2a2a2a;
                          width:180px;
                          color:#f6e7b2;
                          font-size:14px;
                          font-weight:700;
                          vertical-align:top;
                        ">
                          ${label}
                        </td>

                        <td class="value-cell" style="
                          padding:18px 20px;
                          border-bottom:1px solid #2a2a2a;
                          color:#d7d7d7;
                          font-size:14px;
                          line-height:1.8;
                          word-break:break-word;
                        ">
                          ${value}
                        </td>
                      </tr>
                    `,
                    )
                    .join("")}

                </table>

              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="
              padding:28px 24px 40px;
              border-top:1px solid #2a2a2a;
            " class="content-padding">

              <a
                href="mailto:${enquiry.email || ""}"
                class="button"
                style="
                  display:inline-block;
                  margin-bottom:14px;
                  padding:14px 26px;
                  background:linear-gradient(135deg,#c8a96b,#f6e7b2);
                  color:#111111;
                  text-decoration:none;
                  font-size:14px;
                  font-weight:700;
                  border-radius:12px;
                  letter-spacing:0.4px;
                "
              >
                Reply to Customer
              </a>

              <p style="
                margin:0;
                color:#8f8f8f;
                font-size:13px;
                line-height:1.7;
              ">
                You can contact the customer directly via email or WhatsApp for further discussion.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

    // Send admin notification (non‑blocking)
    await sendEmail(email, email, adminSubject, adminHtml).catch((err) =>
      console.error("Failed to send admin email:", err),
    );

    // ---- Thank‑you email to user ----
    if (enquiry.email) {
      const userSubject = `Thank you for your enquiry, ${enquiry.name || "Valued Customer"}!`;
      const userHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    @media only screen and (max-width: 600px) {
      .main-table {
        width: 100% !important;
      }
      .content-padding {
        padding-left: 16px !important;
        padding-right: 16px !important;
      }
      .cta-button {
        width: 100% !important;
        text-align: center !important;
      }
    }
  </style>
</head>

<body style="
  margin:0;
  padding:0;
  background:#0f0f0f;
  font-family:Arial, Helvetica, sans-serif;
">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f0f0f; padding:40px 16px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" border="0" class="main-table"
          style="
            max-width:620px;
            background:#161616;
            border:1px solid #2a2a2a;
            border-radius:24px;
            overflow:hidden;
          "
        >

          <!-- Top Gold Line -->
          <tr>
            <td style="
              height:5px;
              background:linear-gradient(90deg,#c8a96b,#f6e7b2,#c8a96b);
            "></td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding:50px 30px 24px;" class="content-padding">
              <h1 style="
                margin:0;
                color:#f6e7b2;
                font-size:34px;
                font-weight:700;
                letter-spacing:1px;
              ">
                Wedding Planner
              </h1>

              <p style="
                margin-top:12px;
                color:#b5b5b5;
                font-size:15px;
                line-height:1.7;
              ">
                Luxury Events • Elegant Experiences • Timeless Celebrations
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:0 30px 40px;" class="content-padding">

              <div style="
                background:#1d1d1d;
                border:1px solid #2e2e2e;
                border-radius:18px;
                padding:32px;
              ">

                <p style="
                  margin:0 0 18px;
                  color:#ffffff;
                  font-size:18px;
                  font-weight:600;
                ">
                  Dear ${enquiry.name || "Customer"},
                </p>

                <p style="
                  margin:0 0 18px;
                  color:#d0d0d0;
                  font-size:15px;
                  line-height:1.9;
                ">
                  Thank you for reaching out to us regarding your
                  <strong style="color:#f6e7b2;">
                    ${enquiry.eventType || "event"}
                  </strong>.
                </p>

                <p style="
                  margin:0 0 28px;
                  color:#d0d0d0;
                  font-size:15px;
                  line-height:1.9;
                ">
                  We’ve successfully received your enquiry and our team will contact you shortly to discuss your vision in detail.
                </p>

                <!-- CTA -->
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td align="center">
                      <a
                        href="https://wa.me/${process.env.WHATSAPP_NUMBER || "919876543210"}"
                        class="cta-button"
                        style="
                          display:inline-block;
                          padding:15px 28px;
                          background:linear-gradient(135deg,#c8a96b,#f6e7b2);
                          color:#111111;
                          text-decoration:none;
                          font-size:15px;
                          font-weight:700;
                          border-radius:12px;
                          letter-spacing:0.5px;
                        "
                      >
                        Chat on WhatsApp
                      </a>
                    </td>
                  </tr>
                </table>

              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="
              padding:28px 20px 40px;
              border-top:1px solid #2a2a2a;
            " class="content-padding">

              <p style="
                margin:0 0 10px;
                color:#f6e7b2;
                font-size:16px;
                font-weight:600;
              ">
                EventPlanner Team
              </p>

              <p style="
                margin:0;
                color:#8f8f8f;
                font-size:13px;
                line-height:1.7;
              ">
                Crafting unforgettable luxury celebrations with elegance and perfection.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
      await sendEmail(email, enquiry.email, userSubject, userHtml).catch(
        (err) => console.error("Failed to send user email:", err),
      );
    }

    res.status(201).json({ success: true, data: enquiry });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all enquiries (admin)
exports.getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, data: enquiries });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// Update enquiry (mark contacted, add note)
exports.updateEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, data: enquiry });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
