// public/contact.js
const form = document.getElementById("enquiryForm");
const submitBtn = document.getElementById("enquirySubmit");
const note = document.getElementById("enquiryNote");

// --- Create popup ---
const popup = document.createElement("div");
popup.id = "popup";
popup.className =
  "hidden fixed top-6 right-6 z-[9999] px-6 py-4 rounded-xl shadow-lg text-white text-lg font-semibold transition-all duration-300";
document.body.appendChild(popup);

// --- Load whoosh sound ---
const whoosh = new Audio(
  "https://cdn.pixabay.com/download/audio/2022/03/15/audio_8a2be4e9cb.mp3?filename=whoosh-6316.mp3"
);
whoosh.volume = 0.25;

// --- Always send to live API (Vercel) ---
const apiBase = "https://baltic-electric-site.vercel.app/api/sendEmail";

// --- Handle submit ---
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  note.textContent = "Sending...";
  note.className = "text-gray-500";

  const data = Object.fromEntries(new FormData(form).entries());

  try {
    const res = await fetch(apiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      showPopup("✅ Sent successfully!", "#16a34a");
      whoosh.play().catch(() => {});
      note.textContent = "Thank you! We’ll be in touch soon.";
      note.className = "text-green-600";
      form.reset();
    } else {
      throw new Error(result.error || "Failed to send message.");
    }
  } catch (err) {
    console.error("❌ Send error:", err);
    showPopup("⚠️ Failed to send message", "#dc2626");
    note.textContent = "Something went wrong. Please try again later.";
    note.className = "text-red-600";
  } finally {
    submitBtn.disabled = false;
  }
});

// --- Helper popup ---
function showPopup(message, color) {
  popup.textContent = message;
  popup.style.background = color;
  popup.classList.remove("hidden");
  popup.style.opacity = "1";
  popup.style.transform = "translateY(0)";
  setTimeout(() => {
    popup.style.opacity = "0";
    popup.style.transform = "translateY(-10px)";
    setTimeout(() => popup.classList.add("hidden"), 300);
  }, 3000);
}
