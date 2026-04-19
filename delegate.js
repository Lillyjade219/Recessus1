import { db } from './firebase.js';
import { doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const user = localStorage.getItem('recessus_user');
if (!user) window.location.href = 'index.html';

document.getElementById('display-name').textContent = user.toUpperCase();

onSnapshot(doc(db, 'settings', 'global'), async (snap) => {
    if (!snap.exists()) return;
    const data = snap.data();
    
    // Study Guide
    const guideDiv = document.getElementById('guide-container');
    if (data.studyGuideUrl) {
        guideDiv.innerHTML = `<a href="${data.studyGuideUrl}" target="_blank" style="color:#00d2ff;">DOWNLOAD PDF</a>`;
    } else {
        guideDiv.innerHTML = "UNAVAILABLE.";
    }

    // Video Logic
    const vidDiv = document.getElementById('video-wrapper');
    const userSnap = await getDoc(doc(db, 'delegates', user));
    
    if (userSnap.data().hasWatchedVideo) {
        vidDiv.innerHTML = "<p style='color:#ff4b2b; padding:2rem; text-align:center;'>TRANSMISSION LOCKED.</p>";
    } else if (data.videoUrl) {
        vidDiv.innerHTML = `<video id='crisis-vid' width='100%' controls><source src='${data.videoUrl}' type='video/mp4'></video>`;
        document.getElementById('crisis-vid').onended = async () => {
            await setDoc(doc(db, 'delegates', user), { hasWatchedVideo: true }, { merge: true });
            location.reload();
        };
    } else {
        vidDiv.innerHTML = "<p style='padding:2rem; text-align:center;'>NO SIGNAL.</p>";
    }
});

document.getElementById('logout-btn').onclick = () => {
    localStorage.clear();
    window.location.href = 'index.html';
};