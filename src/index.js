import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, push } from 'firebase/database';
import { getAnalytics, logEvent } from 'firebase/analytics';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyB96s5Enyn4m-i5izyS6gM8yhUeRW0KJqU",
    authDomain: "sdg-spam-1.firebaseapp.com",
    databaseURL: "https://sdg-spam-1-default-rtdb.firebaseio.com",
    projectId: "sdg-spam-1",
    storageBucket: "sdg-spam-1.firebasestorage.app",
    messagingSenderId: "439688423237",
    appId: "1:439688423237:web:2d8a1287c744e56c0dc02c",
    measurementId: "G-4K5S5TJZB3"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

//Analytics
const analytics = getAnalytics(app);
logEvent(analytics, 'notification_received');

//Firebase walkthrough
// function writeUserData(userID, name, email, imageUrl) {
//   const db = getDatabase(app);
//   const reference = ref(db, 'users/' + userID);

//   set(reference, {
//     username: name,
//     email: email,
//     profile_picture: imageUrl
//   });
// }

// writeUserData("nameId", "name", "liana@saedesigngroup.com", "myimageurl");

// Reference porportions vote collections
const votesRef = ref(db, 'votes');

//Listen to form submit
document.getElementById('porportionsForm').addEventListener('submit', submitForm);

// Helper function to get selected radio value from a group
function getSelectedRadioValue(radioGroup) {
  for (let i = 0; i < radioGroup.length; i++) {
    if (radioGroup[i].checked) {
      return radioGroup[i].value;
    }
  }
  return null; // Return null if no radio is selected
}

//Submit Form
function submitForm(e, data) {
  e.preventDefault();
  console.log('submit');

  const porportions = document.getElementsByName("porportions");
  const thickness = document.getElementsByName("thickness");
  
  // Get selected values
  const proportionsValue = getSelectedRadioValue(porportions);
  const thicknessValue = getSelectedRadioValue(thickness);

  saveAnswers(proportionsValue, thicknessValue);
}

function saveAnswers(proportionsValue, thicknessValue) {
    // Only proceed if at least one option is selected
  if (proportionsValue || thicknessValue) {
    // Create data object
    const data = {
      vote: proportionsValue || "",
      champion: thicknessValue || "",
      timestamp: new Date().toISOString()
    };
    
    // Push data to Firebase
    const newVoteRef = push(votesRef);
    set(newVoteRef, data)
      .then(() => {
        console.log("Vote submitted successfully:", data);
        readAllVotes();
        // Optional: Reset the form
        document.getElementById('porportionsForm').reset();
        // Uncomment to enable the live listener
        // setupVoteListener(votesRef);

      })
      .catch((error) => {
        console.error("Error submitting vote:", error);
      });
  } else {
    console.log("Please select at least one option");
    // You could add some UI feedback here
  }
}

// If you want to listen for votes and update the UI
function readAllVotes() {
  onValue(votesRef, (snapshot) => {
    const votesData = snapshot.val();
    console.log("All votes in database:", votesData);
      // You can process the data here and update UI elements
      // updateVotesDisplay(votesData);

    if (votesData) {
      Object.keys(votesData).forEach(key => {
        console.log(`Vote ${key}:`, votesData[key]);
      });
    }
  }, {
    onlyOnce: true
  })
}
