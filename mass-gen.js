import { db } from './firebase.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const delegates = [
    "vivaan_s", "anandita_d", "arunima_c", "divyansh_i",
    "maxwell", "janice_h", "david_j", "emily_m", 
    "matthias_a", "clara_b", "lukas_r", "emilia_v", "jonas_k",
    "oliver_w", "amelia_k", "thomas_c", "charlotte_h", "sebastian_r",
    "eitan_l", "noam_a", "yael_b", "ronen_s", "tamar_h",
    "lucien_m", "elodie_g", "marc_d", "antoine_l", 
    "zhou_r", "liu_q", "huang_y", "gao_w", 
    "viktor_m", "sergei_a", "irina_v", "oleg_v", 
    "khalid_m", "fahad_r", "hassan_q", "majid_h", 
    "min_jae_p", "soo_yeon_k", "jin_woo_h", "dae_hyun_l", 
    "haruto_n", "aiko_t", "kenji_w", "takumi_s", 
    "jonas_s", "hannah_k", "lena_h", "maximilian_v", 
    "omar_k", "nabil_h", "samira_k", "youssef_d", 
    "thabo_n", "amina_d", "kofi_m", "lindiwe_o", 
    "isabella_r", "matteo_s", "claire_v", "andreas_k" 
];

const generateKey = () => Math.random().toString(36).slice(-6).toUpperCase();

async function initializeDatabase() {
    const status = document.getElementById('status-msg');
    status.textContent = "COMMENCING MASS UPLINK...";
    
    try {
        for (let user of delegates) {
            const pass = generateKey();
            
            await setDoc(doc(db, 'delegates', user), {
                passcode: pass,    
                hasWatchedVideo: false, 
                attendance: "absent",   
                is_voting: false       
            }, { merge: true });

            console.log(`UPLINK SUCCESS: ${user} | KEY: ${pass}`);
        }
        status.textContent = "MASS UPLINK COMPLETE. CHECK CONSOLE FOR KEYS.";
        alert("62 DELEGATES INITIALIZED IN FIREBASE.");
    } catch (error) {
        status.textContent = "UPLINK CRITICAL FAILURE.";
        console.error(error);
    }
}

document.getElementById('gen-btn').onclick = initializeDatabase;