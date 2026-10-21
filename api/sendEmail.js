import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const destination = process.env.ENQUIRY_TO || smtpUser;

  // Credentials must be set in the hosting platform, never committed to Git.
  if (!smtpUser || !smtpPass || !destination) {
    console.error("Enquiry mail configuration is incomplete.");
    return res.status(503).json({ error: "Email service temporarily unavailable" });
  }

  const { fullName = "", email = "", phone = "", service = "", message = "" } = req.body || {};
  const trim = (value, max) => String(value).trim().slice(0, max);
  const name = trim(fullName, 120);
  const sender = trim(email, 200);
  const telephone = trim(phone, 80);
  const category = trim(service, 100).replace(/[\r\n]/g, " ");
  const details = trim(message, 5000);

  if (!name || !details || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sender)) {
    return res.status(400).json({ error: "Please provide your name, a valid email and a message." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.office365.com",
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `"BTS Website Enquiry" <${smtpUser}>`,
      replyTo: sender,
      to: destination,
      subject: `BTS Enquiry: ${category || "General"}`,
      text: [
        "New BTS website enquiry",
        `Name: ${name}`,
        `Email: ${sender}`,
        `Phone: ${telephone || "Not supplied"}`,
        `Service: ${category || "General"}`,
        "",
        details,
      ].join("\n"),
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to send website enquiry:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
