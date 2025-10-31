// contact.js — handles the "Get a Quote" form
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const button = form.querySelector("button");
  const originalText = button.textContent;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    button.disabled = true;
    button.textContent = "Sending...";

    const data = {
      name: form.querySelector('input[placeholder="Full name"]').value,
      email: form.querySelector('input[type="email"]').value,
      message: form.querySelector("textarea").value,
    };

    try {
      const res = await fetch("https://baltic-electric-site.vercel.app/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Message sent successfully! We'll reply within 1 business day.");
        form.reset();
      } else {
        console.error("Email error:", result.error);
        alert("⚠️ Failed to send message. Please try again later.");
      }
    } catch (err) {
      console.error("Error sending:", err);
      alert("⚠️ Network error. Please try again.");
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  });
});
