import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// ✅ Diva Ads Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCHBwbf8yj_iIGiRAlfa9ZC7fe7ji7zmDE",
  authDomain: "diva-ads.firebaseapp.com",
  projectId: "diva-ads",
  storageBucket: "diva-ads.appspot.com",
  messagingSenderId: "80165354631",
  appId: "1:80165354631:web:233be7844f7d8431c7cc22",
  measurementId: "G-Q9RSHE0ZPP"
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔐 Protect admin access
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    document.getElementById("adminEmail").textContent = user.email;
    await loadDashboardData();
  }
});

// 🚪 Logout button
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});

// 📊 Load user data from Firestore
async function loadDashboardData() {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);

  let totalUsers = 0;
  let totalEarnings = 0;
  let pendingWithdrawals = 0;

  const tableBody = document.getElementById("userTable");
  tableBody.innerHTML = "";

  snapshot.forEach((doc) => {
    const data = doc.data();
    totalUsers++;
    totalEarnings += Number(data.balance || 0);
    if (data.status === "pending") pendingWithdrawals++;

    const row = `
      <tr>
        <td>${data.email || "N/A"}</td>
        <td>$${(data.balance || 0).toFixed(2)}</td>
        <td>${data.status || "Active"}</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });

  document.getElementById("totalUsers").textContent = totalUsers;
  document.getElementById("totalEarnings").textContent = `$${totalEarnings.toFixed(2)}`;
  document.getElementById("pending").textContent = pendingWithdrawals;
  }
