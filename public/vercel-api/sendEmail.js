// === sendEmail.js ===
// Simple serverless email sender for Baltic Electric using Outlook SMTP

import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, service, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Setup Outlook SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: "admin@balticelectric.com",
      pass: process.env.OUTLOOK_APP_PASSWORD, // use env var for security
    },
  });

  const mailOptions = {
    from: `"Baltic Electric Website" <admin@balticelectric.com>`,
    to: "admin@balticelectric.com",
    subject: `New Enquiry from ${name}`,
    text: `
You have a new enquiry:

Name: ${name}
Email: ${email}
Phone: ${phone || "N/A"}
Service: ${service || "N/A"}

Message:
${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
    return res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
