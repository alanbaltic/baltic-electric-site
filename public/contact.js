<script type="module">
  import { firebaseConfig } from "./firebase-config.js";
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
  import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

  const app = initializeApp(firebaseConfig);
  const db  = getFirestore(app);

  const form = document.getElementById("enquiryForm");
  const btn  = document.getElementById("enquirySubmit");
  const note = document.getElementById("enquiryNote");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      btn.disabled = true;
      btn.textContent = "Sending…";
      note.textContent = "";

      const name    = form.querySelector("[name='fullName']").value.trim();
      const email   = form.querySelector("[name='email']").value.trim();
      const phone   = form.querySelector("[name='phone']").value.trim();
      const service = form.querySelector("[name='service']").value;
      const message = form.querySelector("[name='message']").value.trim();

      try {
        await addDoc(collection(db, "enquiries"), {
          name, email, phone, service, message,
          created: serverTimestamp()
        });
        form.reset();
        note.className = "text-green-500 mt-3 text-sm";
        note.textContent = "Thanks! We’ve received your enquiry.";
      } catch (err) {
        console.error(err);
        note.className = "text-red-500 mt-3 text-sm";
        note.textContent = "Sorry, something went wrong. Please try again.";
      } finally {
        btn.disabled = false;
        btn.textContent = "Send Enquiry";
      }
    });
  }
</script>
