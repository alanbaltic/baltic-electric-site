export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const { name, email, message } = req.body || {};
    console.log("📧 Email received:", { name, email, message });

    // This just logs for now — you can hook up Microsoft 365 SMTP later
    return res.status(200).json({ success: true, msg: "Message received" });
  } catch (err) {
    console.error("❌ API Error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
