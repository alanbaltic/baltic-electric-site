// api/sendEmail.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, service, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: "admin@balticelectric.com",
        pass: "gqqfpzyjtmlpypjm", // We'll hide this later!
      },
    });

    await transporter.sendMail({
      from: '"Baltic Electric" <admin@balticelectric.com>',
      to: "admin@balticelectric.com",
      subject: `New Enquiry from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone || "N/A"}
        Service: ${service}
        Message:
        ${message}
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({ error: "Email failed to send." });
  }
}
