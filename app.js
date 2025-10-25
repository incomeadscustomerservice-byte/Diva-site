// DIVA ADS 💛 — Basic App Script

// --- Firebase Configuration (replace with your own from Firebase Console) ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// --- Initialize Firebase ---
try {
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully!");
} catch (error) {
  console.log("Firebase not configured yet — that's okay for now!");
}

// --- Login Form ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Login successful ✅');
    window.location.href = 'dashboard.html';
  });
}

// --- Register Form ---
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Account created successfully 🎉');
    window.location.href = 'login.html';
  });
}

// --- Logout Button ---
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    alert('You have been logged out 👋');
    window.location.href = 'index.html';
  });
}

// --- Withdraw Button (Dashboard) ---
const withdrawBtn = document.getElementById('withdrawBtn');
if (withdrawBtn) {
  withdrawBtn.addEventListener('click', () => {
    alert('Withdrawal request sent ✅');
  });
}
