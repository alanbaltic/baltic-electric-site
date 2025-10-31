// === Firebase Functions for Baltic Electric ===
// This handles contact form email sending + saves enquiries to Firestore.

import functions from "firebase-functions";
import admin from "firebase-admin";
import nodemailer from "nodemailer";

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// === Configure Microsoft 365 SMTP ===
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: "admin@balticelectric.com", // your Microsoft 365 email
    pass: "gqqfpzyjtmlpypjm" // ⚠️ replace with App Password (not your login)
  },
  tls: {
    ciphers: "SSLv3",
  },
});

// === Cloud Function to Send Email + Save Enquiry ===
export const sendEnquiry = functions.https.onCall(async (data, context) => {
  const { name, email, phone, service, message } = data;

  if (!name || !email || !message) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required fields");
  }

  // Save to Firestore for backup
  const docRef = await db.collection("enquiries").add({
    name,
    email,
    phone: phone || "",
    service: service || "",
    message,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Prepare email
  const mailOptions = {
    from: `"Baltic Electric Website" <admin@balticelectric.com>`,
    to: "admin@balticelectric.com",
    subject: `New Enquiry from ${name}`,
    text: `
You have a new enquiry from your website:

Name: ${name}
Email: ${email}
Phone: ${phone || "N/A"}
Service: ${service || "N/A"}

Message:
${message}

Stored in Firestore document: ${docRef.id}
    `,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
  console.log("✅ Enquiry email sent and saved:", docRef.id);

  return { success: true, message: "Email sent successfully!" };
});
