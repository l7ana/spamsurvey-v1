import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, push } from 'firebase/database';
import { getAnalytics, logEvent } from 'firebase/analytics';
import '../styles.css';
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

// Reference proportions vote collections
const votesRef = ref(db, 'votes');

//Listen to form submit
document.getElementById('proportionsForm').addEventListener('submit', submitForm);

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

  const proportions = document.getElementsByName("rice-proportions");
  const thickness = document.getElementsByName("spam-thickness");
  
  // Get selected values
  const proportionsValue = getSelectedRadioValue(proportions);
  const thicknessValue = getSelectedRadioValue(thickness);

  saveAnswers(proportionsValue, thicknessValue);
}

function saveAnswers(proportionsValue, thicknessValue) {
    // Only proceed if at least one option is selected
  if (proportionsValue || thicknessValue) {
    // Create data object
    const data = {
      ricePorportions: proportionsValue || "",
      spamThickness: thicknessValue || "",
      timestamp: new Date().toISOString()
    };
    
    // Push data to Firebase
    const newVoteRef = push(votesRef);
    set(newVoteRef, data)
      .then(() => {
        console.log("Vote submitted successfully:", data);
        readAllVotes();
        // Optional: Reset the form
        document.getElementById('proportionsForm').reset();

      })
      .catch((error) => {
        console.error("Error submitting vote:", error);
      });
  } else {
    console.log("Please select at least one option");
  }
}

const resultsContainer = document.getElementById('results');
const riceResults = document.querySelectorAll('[data-rice-porportions-results]');
const spamThicknessResults = document.querySelectorAll('[data-results="spamThickness"]');

function updateRicePorportions () {
  riceResults.forEach(element => {
    //find the html element and insert result amount
    const elVal = element.dataset.ricePorportionsResults;
    element.innerHTML = `<p>${elVal}</p>`;
  });
}

function updateTotals(resultTotal, sum) {
    document.querySelector(resultTotal).innerHTML = `<p>Total Votes:${sum}</p>`
}

// If you want to listen for votes and update the UI
function readAllVotes() {
  onValue(votesRef, (snapshot) => {
    const votesData = snapshot.val();
    console.log("All votes in database:", votesData);
      // You can process the data here and update UI elements
      // updateVotesDisplay(votesData);
      resultsContainer.hidden = false;
      resultsContainer.style.visibility="visible";
      resultsContainer.style.display="block";

      //way to filter votes data to tally each answer to each question
      let ricePorportionsVotes1 = 0;
      let ricePorportionsVotes2 = 0;
      let ricePorportionsVotes3 = 0;
      let ricePorportionsVotes4 = 0;
      let ricePorportionsVotes5 = 0;

    if (votesData) {
      Object.keys(votesData).forEach(key => {
        console.log(votesData[key].ricePorportions);
        console.log(votesData[key].spamThickness);


        if (votesData[key].ricePorportions === 'rice1') {
          ricePorportionsVotes1++;
        }
        if (votesData[key].ricePorportions === 'rice2') {
          ricePorportionsVotes2++;
        }
        if (votesData[key].ricePorportions === 'rice3') {
          ricePorportionsVotes3++;
        }
        if (votesData[key].ricePorportions === 'rice4') {
          ricePorportionsVotes4++;
        }
        if (votesData[key].ricePorportions === 'rice5') {
          ricePorportionsVotes5++;
        }

        updateTotals('[data-rice-porportions-results="1"]', ricePorportionsVotes1);
        updateTotals('[data-rice-porportions-results="2"]', ricePorportionsVotes2);
        updateTotals('[data-rice-porportions-results="3"]', ricePorportionsVotes3);
        updateTotals('[data-rice-porportions-results="4"]', ricePorportionsVotes4);
        updateTotals('[data-rice-porportions-results="5"]', ricePorportionsVotes5);
      });
    }
  }, {
    onlyOnce: true
  })
}
