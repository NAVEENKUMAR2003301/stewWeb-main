const nodemailer = require("nodemailer");
const email=process.env.ADMIN_EMAIL
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: process.env.PASS,
  },
});

const sendEmail = async (from, to, subject, message) => {
  await transporter.sendMail({
    from: `"${from}" <${email}>`,
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>${subject}</h2>

        <p>
          <strong>From:</strong> ${from}
        </p>

        <p>
          <strong>Message:</strong>
        </p>

        <p>${message}</p>
      </div>
    `,
  });

  console.log("Email sent successfully");
};

module.exports = sendEmail;