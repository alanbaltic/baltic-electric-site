// public/api/sendEmail.js

import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // ✅ Allow Firebase frontend + local dev
  res.setHeader("Access-Control-Allow-Origin", "https://balticelectric-afff2.web.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { fullName, email, phone, service, message } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // ✅ Microsoft 365 SMTP configuration
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: "admin@balticelectric.com",
        pass: "gqqfpzyjtmlpypjm", // ← App password
      },
    });

    // ✅ Email to Baltic Electric (your admin inbox)
    const adminMail = {
      from: '"Baltic Electric Enquiries" <admin@balticelectric.com>',
      to: "admin@balticelectric.com",
      subject: `New Enquiry from ${fullName}`,
      html: `
        <h2>New Enquiry Received</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr />
        <p style="font-size:12px;color:#666;">Sent automatically from balticelectric.com</p>
      `,
    };

    // ✅ Auto “thank you” reply to the user
    const userMail = {
      from: '"Baltic Electric" <admin@balticelectric.com>',
      to: email,
      subject: "Thanks for contacting Baltic Electric ⚡",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;padding:20px;">
          <h2 style="color:#1E2A46;">Hi ${fullName},</h2>
          <p>Thanks for getting in touch with <strong>Baltic Electric</strong>!<br/>
          We’ve received your enquiry about <strong>${service}</strong>.</p>
          <p>Our team will review your message and respond within 1 business day.</p>
          <hr/>
          <p style="font-size:13px;color:#777;">
            — The Baltic Electric Team<br/>
            <a href="https://balticelectric.com" style="color:#F6B800;">balticelectric.com</a>
          </p>
        </div>
      `,
    };

    // ✅ Send both emails
    await transporter.sendMail(adminMail);
    await transporter.sendMail(userMail);

    console.log(`✅ Enquiry received from ${fullName} <${email}>`);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Email send error:", error);
    return res.status(500).json({ error: "Failed to send email." });
  }
}
