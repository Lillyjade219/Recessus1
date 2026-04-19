import { db } from './firebase.js';
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.querySelector('button');
    btn.textContent = "INITIALIZING...";
    
    const user = document.getElementById('username').value.trim().toLowerCase(); // Ensure lowercase
    const pass = document.getElementById('password').value;
    const err = document.getElementById('error-msg');

    // NEW: Capture Allocation and Attendance [cite: 10, 11]
    const allocation = document.getElementById('allocation').value;
    const attendance = document.querySelector('input[name="attendance"]:checked')?.value;

    if (!attendance) {
        err.textContent = "SELECT ATTENDANCE STATUS.";
        btn.textContent = "LOGIN";
        return;
    }

    try {
        const snap = await getDoc(doc(db, 'delegates', user));
        
        if (snap.exists() && snap.data().passcode === pass) {
            // 1. Update Firebase (Attendance & Allocation) [cite: 55, 56]
            await setDoc(doc(db, 'delegates', user), {
                allocation: allocation,
                attendance: attendance,
                is_voting: attendance === 'voting', // [cite: 31-48]
                lastActive: new Date().toLocaleTimeString()
            }, { merge: true });

            // 2. Save to Local Storage and FORCE Redirect
            localStorage.setItem('recessus_user', user);
            console.log("LOGIN SUCCESSFUL. REDIRECTING...");
            window.location.href = 'delegate.html'; 
        } else {
            err.textContent = "ACCESS DENIED. CHECK KEY.";
            btn.textContent = "LOGIN";
        }
    } catch (error) {
        console.error(error);
        err.textContent = "UPLINK ERROR. CHECK CONNECTION.";
        btn.textContent = "LOGIN";
    }
});