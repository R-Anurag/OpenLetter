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
const likeKey = "liked-" + pageId;
const likeButton = document.querySelector('.like');
const likeValue = document.querySelector('.like-value');
const impressionValue = document.querySelector(".impression-value");

// --- IMPRESSION TRACKING ---
async function trackImpression() {
  try {
    const docRef = doc(db, "stats", pageId);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      // Initialize document if not exists (first time view), set impressions and likes to 0
      await setDoc(docRef, { impressions: 0, likes: 0 }, { merge: true });
    }

    // Increment impressions count on each page load
    await updateDoc(docRef, { impressions: increment(1) });
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

// --- READ STATS FROM FIRESTORE ---
async function displayStats() {
  try {
    const snap = await getDoc(doc(db, "stats", pageId));
    if (snap.exists()) {
      const data = snap.data();
      console.log("Firestore data:", data);

      // Show likes and impressions from Firestore
      likeValue.textContent = data.likes ?? 0;  // Likes from Firestore or 0 if not set
      impressionValue.textContent = data.impressions ?? 0; // Impressions from Firestore or 0

      // Sync localStorage like state with Firestore value
      if (localStorage.getItem(likeKey)) {
        likeButton.classList.add("liked");  // User already liked the page
      } else {
        likeButton.classList.remove("liked"); // User has not liked the page
      }
    } else {
      // If Firestore document does not exist, create it with default values
      await setDoc(doc(db, "stats", pageId), { likes: 0, impressions: 0 });
      likeValue.textContent = 0;
      impressionValue.textContent = 0;
    }
  } catch (e) {
    console.error("Error reading stats:", e);
  }
}

// --- LIKE EVENT HANDLER ---
likeButton?.addEventListener('click', async () => {
  const isLiked = localStorage.getItem(likeKey);

  // Toggle like state
  if (!isLiked) {
    // Like the page
    localStorage.setItem(likeKey, "true");
    await updateLikeCount(1); // Increment likes in Firestore
    likeButton.classList.add("liked");
  } else {
    // Unlike the page
    localStorage.removeItem(likeKey);
    await updateLikeCount(-1); // Decrement likes in Firestore
    likeButton.classList.remove("liked");
  }

  // Refresh stats after like/unlike
  displayStats();
});

// --- INIT: Load stats on page load ---
window.addEventListener("DOMContentLoaded", () => {
  // Track impression when the page loads
  trackImpression();
  
  // Fetch and display stats after page load
  displayStats();
});
