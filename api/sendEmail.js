import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // --- ✅ Allow Firebase + Vercel + Localhost (CORS fix)
  const allowedOrigins = [
    "https://balticelectric-afff2.web.app", // Firebase hosting
    "https://baltic-electric-site.vercel.app", // Vercel hosting
    "http://localhost:5500", // local testing
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { fullName, email, phone, service, message } = req.body;

    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: "admin@balticelectric.com",
        pass: "gqqfpzyjtmlpypjm", // App Password
      },
    });

    await transporter.sendMail({
      from: `"Baltic Electric Enquiry" <admin@balticelectric.com>`,
      to: "admin@balticelectric.com",
      subject: `New Enquiry: ${service || "General"}`,
      text: `
New enquiry received:

Name: ${fullName}
Email: ${email}
Phone: ${phone || "N/A"}
Service: ${service || "N/A"}

Message:
${message}
      `,
    });

    console.log("✅ Email sent successfully");
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Email send error:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
