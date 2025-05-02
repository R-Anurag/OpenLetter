import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, doc, setDoc, updateDoc, increment, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// --- FIREBASE CONFIG --- (frontend-safe)
const firebaseConfig = {
  apiKey: "AIzaSyCkQcooYANlNMtCeQkirONRDKjbZajsIjY",
  authDomain: "openletter-43e77.firebaseapp.com",
  projectId: "openletter-43e77",
  storageBucket: "openletter-43e77.firebasestorage.app",
  messagingSenderId: "559959689992",
  appId: "1:559959689992:web:7a746ebbdcd322a350fabd"
};

// --- INIT ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- PAGE ID (unique per component/page) ---
const pageId = "chat-anurag";

// --- ELEMENTS ---
const likeButton = document.querySelector('.like');
const likeValue = document.querySelector('.like-value');

// --- IMPRESSION TRACKING ---
async function trackImpression() {
  try {
    const docRef = doc(db, "stats", pageId);
    await setDoc(docRef, { impressions: increment(1) }, { merge: true });
    console.log("Impression tracked.");
  } catch (e) {
    console.error("Error tracking impression:", e);
  }
}


// --- LIKE LOGIC ---
async function updateLikeCount(change) {
  const docRef = doc(db, "stats", pageId);
  await setDoc(docRef, { likes: increment(change) }, { merge: true });
}

async function displayStats() {
  try {
    const snap = await getDoc(doc(db, "stats", pageId));
    if (snap.exists()) {
      const data = snap.data();
      console.log("Fetched data:", data);

      likeValue.textContent = data.likes ?? 0;

      // Restore like state from localStorage
      if (localStorage.getItem("liked-" + pageId)) {
        likeButton.classList.add('liked');
      }
    } else {
      console.warn("No document found for page:", pageId);
      likeValue.textContent = "0";
    }
  } catch (e) {
    console.error("Error displaying stats:", e);
  }
}


// --- LIKE EVENT ---
likeButton?.addEventListener('click', async () => {
  const key = "liked-" + pageId;
  const isLiked = localStorage.getItem(key);

  if (!isLiked) {
    localStorage.setItem(key, "true");
    await updateLikeCount(1);
    likeButton.classList.add("liked");
  } else {
    localStorage.removeItem(key);
    await updateLikeCount(-1);
    likeButton.classList.remove("liked");
  }

  // Refresh count
  displayStats();
});

// --- INIT ---
window.addEventListener("DOMContentLoaded", () => {
  trackImpression();
  displayStats();
});
