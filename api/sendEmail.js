export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  res.status(200).json({ success: true, message: "API connected successfully!" });
}
