import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, message, service } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Create reusable transporter object using Microsoft 365 SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: "admin@balticelectric.com",
        pass: "gqqfpzyjtmlpypjm", // your app password
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    // Email details
    const mailOptions = {
      from: '"Baltic Electric Website" <admin@balticelectric.com>',
      to: "admin@balticelectric.com",
      subject: `New enquiry from ${name}`,
      html: `
        <h2>New Website Enquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${service ? `<p><strong>Service:</strong> ${service}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Email send error:", error);
    return res.status(500).json({ error: "Failed to send email." });
  }
}
