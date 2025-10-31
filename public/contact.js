// contact.js
const form = document.getElementById("enquiryForm");
const submitBtn = document.getElementById("enquirySubmit");
const note = document.getElementById("enquiryNote");

// --- Create popup element ---
const popup = document.createElement("div");
popup.id = "popup";
popup.className =
  "hidden fixed top-6 right-6 z-[9999] px-6 py-4 rounded-xl shadow-lg text-white text-lg font-semibold transition-all duration-300";
document.body.appendChild(popup);

// --- Load soft whoosh sound ---
const whoosh = new Audio(
  "https://cdn.pixabay.com/download/audio/2022/03/15/audio_8a2be4e9cb.mp3?filename=whoosh-6316.mp3"
);
whoosh.volume = 0.25;

// --- Dynamically choose API base ---
const apiBase = window.location.hostname.includes("vercel.app")
  ? "/api/sendEmail"
  : "https://baltic-electric-site.vercel.app/api/sendEmail";

// --- Event listener for form submit ---
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

    if (!res.ok) throw new Error("Network response was not OK");

    const result = await res.json();

    if (result.success) {
      showPopup("✅ Sent successfully!", "#16a34a"); // green
      whoosh.play().catch(() => {}); // play whoosh quietly
      note.textContent = "Thank you! We’ll be in touch soon.";
      note.className = "text-green-600";
      form.reset();
    } else {
      throw new Error(result.error || "Unknown error");
    }
  } catch (err) {
    console.error("❌ Send error:", err);
    showPopup("⚠️ Something went wrong", "#dc2626"); // red
    note.textContent = "Something went wrong. Please try again.";
    note.className = "text-red-600";
  } finally {
    submitBtn.disabled = false;
  }
});

// --- Helper: show popup ---
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
