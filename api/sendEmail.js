export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  res.status(200).json({ success: true, message: "API connected successfully!" });
}
