const admin = require('firebase-admin');
const fs = require('fs');
const csv = require('csv-parser');

// 1. Initialize Firebase with your key
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const results = [];

// 2. Read your specific CSV file
fs.createReadStream('Database for RC - Sheet1 (1).csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', async () => {
    console.log(`Found ${results.length} users. Starting upload...`);

    for (const user of results) {
      const username = user.username.trim();
      
      try {
        // We map the CSV columns to the Firestore document
        await db.collection('users').doc(username).set({
          passcode: user.passcode,
          full_name: user.full_name,
          title: user.title,
          country: user.country,
          role: user.role,
          // Convert string "True"/"False" to actual Booleans
          isHeadOfState: user.isHeadOfState.toLowerCase() === 'true',
          attendance: user.attendance.toLowerCase() === 'true',
          hasWatchedVideo: user.hasWatchedVideo.toLowerCase() === 'true',
          is_voting: user.is_voting.toLowerCase() === 'true',
          
          has_voted_crisis1: false,
          has_voted_crisis2: false,
          has_voted_crisis3: false,
          has_voted_crisis4: false,
          
          vote_crisis1: "",
          vote_crisis2: "",
          vote_crisis3: "",
          vote_crisis4: "",
          
          veto_used_crisis1: false,
          veto_used_crisis2: false,
          veto_used_crisis3: false,
          veto_used_crisis4: false
        });
        console.log(`✅ Uploaded: ${username}`);
      } catch (error) {
        console.error(`❌ Failed to upload ${username}:`, error);
      }
    }
    console.log("Done! All users are now in your Firestore 'users' collection.");
    process.exit();
  });