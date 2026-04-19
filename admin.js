import { db, storage } from './firebase.js';
import { ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// SIMPLE ACCESS CONTROL
const PASS = prompt("ENTER LEVEL 5 CLEARANCE KEY:");
if (PASS === "Crescendo2026") {
    document.getElementById('admin-panel').style.display = "block";
} else {
    alert("ACCESS DENIED.");
    window.location.href = "index.html";
}

const status = document.getElementById('status-msg');

async function handleUpload(file, storagePath, dbField) {
    if (!file) return alert("NO FILE SELECTED.");
    
    status.textContent = "INITIALIZING UPLINK...";
    
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            status.textContent = `TRANSMITTING: ${Math.round(progress)}%`;
        }, 
        (err) => { 
            status.textContent = "UPLINK FAILED.";
            console.error(err);
        }, 
        async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            // Save the URL to the 'global' document in 'settings' collection
            await setDoc(doc(db, 'settings', 'global'), {
                [dbField]: url
            }, { merge: true });
            status.textContent = "ASSET DEPLOYED SUCCESSFULLY.";
        }
    );
}

import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Listen for all delegate updates 
onSnapshot(collection(db, 'delegates'), (snapshot) => {
    const listDiv = document.getElementById('attendance-list');
    listDiv.innerHTML = ""; // Clear old list

    snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.attendance && data.attendance !== "absent") {
            // Create a small "Pretty ASF" card for each present delegate 
            const card = document.createElement('div');
            card.className = "detail-card";
            card.style.padding = "1rem";
            card.innerHTML = `
                <strong style="color:var(--gold-solid);">${doc.id.toUpperCase()}</strong><br>
                <span style="font-size:0.8rem;">${data.attendance.replace('_', ' ').toUpperCase()}</span>
            `;
            listDiv.appendChild(card);
        }
    });
});
document.getElementById('upload-guide-btn').onclick = () => {
    const file = document.getElementById('guide-file').files[0];
    handleUpload(file, 'assets/study_guide.pdf', 'studyGuideUrl');
};

import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Listen for any delegate who marks themselves as Present 
onSnapshot(collection(db, 'delegates'), (snapshot) => {
    const display = document.getElementById('attendance-list');
    display.innerHTML = ""; // Clear the "Awaiting" message

    import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// LIVE ATTENDANCE FEED [cite: 55, 56]
onSnapshot(collection(db, 'delegates'), (snapshot) => {
    const display = document.getElementById('attendance-display');
    if(!display) return;
    display.innerHTML = ""; 

    snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.attendance && data.attendance !== "absent") {
            const card = document.createElement('div');
            card.className = "attendance-card";
            card.innerHTML = `
                <div style="border: 1px solid var(--gold-solid); padding: 10px; margin: 5px;">
                    <strong style="color:var(--gold-solid);">${doc.id.toUpperCase()}</strong><br>
                    <span style="font-size:0.7rem;">${data.allocation} // ${data.attendance.toUpperCase()}</span>
                </div>
            `;
            display.appendChild(card);
        }
    });
});

document.getElementById('upload-video-btn').onclick = () => {
    const file = document.getElementById('video-file').files[0];
    handleUpload(file, 'assets/crisis_video.mp4', 'videoUrl');
};