// dashboard.js — modular Firebase v10
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// --- YOUR firebaseConfig (diva-web7) ---
const firebaseConfig = {
  apiKey: "AIzaSyBbH8TEhwYOcnr7nQyCsNYjY_f2GFWwZtQ",
  authDomain: "diva-web7.firebaseapp.com",
  projectId: "diva-web7",
  storageBucket: "diva-web7.firebasestorage.app",
  messagingSenderId: "125041351657",
  appId: "1:125041351657:web:812f04c11dfee2734dc978",
  measurementId: "G-XZR86PRGMP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// UI elements
const affiliateEl = document.getElementById('affiliateBalance');
const activityEl = document.getElementById('activityBalance');
const displayNameEl = document.getElementById('displayName');
const taskBtn = document.getElementById('taskBtn');
const watchAdBtn = document.getElementById('watchAdBtn');
const withdrawBtn = document.getElementById('withdrawBtn');
const withdrawAmountEl = document.getElementById('withdrawAmount');
const logoutBtn = document.getElementById('logoutBtn');
const refreshBtn = document.getElementById('refreshBtn');

let currentUserRef = null;
let currentUid = null;

function showToast(msg){
  alert(msg); // simple — replace with nicer UI as needed
}

// when auth state changes
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // Not signed in — redirect to login
    window.location.href = 'login.html';
    return;
  }

  currentUid = user.uid;
  displayNameEl.textContent = user.displayName || user.email.split('@')[0] || 'Affiliate';

  currentUserRef = doc(db, 'users', currentUid);

  // ensure user doc exists
  const snap = await getDoc(currentUserRef);
  if (!snap.exists()) {
    await setDoc(currentUserRef, {
      username: user.displayName || user.email.split('@')[0],
      email: user.email,
      phone: '',
      affiliateBalance: 0,
      activityBalance: 0,
      referrals: 0,
      createdAt: serverTimestamp()
    });
  }

  // load and render balances
  await loadBalances();
  // optional: load basic stats (clicks/views/referrals) if present
  const docSnap = await getDoc(currentUserRef);
  const data = docSnap.data() || {};
  document.getElementById('statClicks').textContent = data.clicks ?? 0;
  document.getElementById('statViews').textContent = data.views ?? 0;
  document.getElementById('statReferrals').textContent = data.referrals ?? 0;
});

// load balances from Firestore
async function loadBalances(){
  if (!currentUserRef) return;
  const snap = await getDoc(currentUserRef);
  if (!snap.exists()) return;
  const d = snap.data();
  affiliateEl.textContent = (d.affiliateBalance ?? 0).toLocaleString();
  activityEl.textContent = (d.activityBalance ?? 0).toLocaleString();
}

// increment helper
async function addToBalance(field, amount){
  if (!currentUserRef) return;
  await updateDoc(currentUserRef, {
    [field]: increment(amount)
  });
  await loadBalances();
}

// Task button (₦50)
if (taskBtn){
  taskBtn.addEventListener('click', async () => {
    try {
      taskBtn.disabled = true;
      taskBtn.textContent = 'Completing...';
      // you can add validation, cooldowns, task-check logic here
      await addToBalance('activityBalance', 50);
      showToast('✅ Task completed! You earned ₦50');
    } catch(e){
      console.error(e);
      showToast('Error completing task');
    } finally {
      taskBtn.disabled = false;
      taskBtn.textContent = 'Complete Task (₦50)';
    }
  });
}

// Watch ad button (₦10)
if (watchAdBtn){
  watchAdBtn.addEventListener('click', async () => {
    try {
      watchAdBtn.disabled = true;
      watchAdBtn.textContent = 'Watching...';
      // simulate ad watch delay
      await new Promise(r => setTimeout(r, 2500));
      await addToBalance('activityBalance', 10);
      showToast('✅ Ad watched! You earned ₦10');
    } catch(e){
      console.error(e);
      showToast('Error watching ad');
    } finally {
      watchAdBtn.disabled = false;
      watchAdBtn.textContent = 'Watch Ad (₦10)';
    }
  });
}

// Withdraw request
if (withdrawBtn){
  withdrawBtn.addEventListener('click', async () => {
    const amt = Number(withdrawAmountEl.value);
    if (!amt || amt < 2000) {
      showToast('Minimum withdrawal is ₦2000');
      return;
    }
    try {
      // create a withdrawal request doc
      await addDoc(collection(db, 'withdrawals'), {
        userId: currentUid,
        amount: amt,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      showToast('✅ Withdrawal requested. Admin will review it.');
      withdrawAmountEl.value = '';
    } catch(e){
      console.error(e);
      showToast('Error requesting withdrawal');
    }
  });
}

// logout
if (logoutBtn){
  logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = 'login.html';
  });
}

// refresh button
if (refreshBtn){
  refreshBtn.addEventListener('click', loadBalances);
}
