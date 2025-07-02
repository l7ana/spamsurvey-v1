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

//Question config
const QUESTION_CONFIG = {
  riceProportions: {
    values: ['little-bit', 'less', 'normal', 'more', 'choke'],
    selector: '[data-rice-proportions-results="{index}"]'
  },
  spamThickness: {
    values: ['paper-thin', 'thin', 'average', 'thick', 'fat'],
    selector: '[data-spam-thickness-results="{index}"]'
  }
}

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
      riceProportions: proportionsValue || "",
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
        // document.getElementById('proportionsForm').reset();

      })
      .catch((error) => {
        console.error("Error submitting vote:", error);
      });
  } else {
    console.log("Please select at least one option");
  }
}

function countVotes(votesData, questionKey, questionConfig) {
  const counts = {};

  //Initialize counts for all values
  questionConfig.values.forEach(value => {
    counts[value] = 0;
  });

  //Count votes from data
  if (votesData) {
    Object.values(votesData).forEach(vote => {
      const answer = vote[questionKey];
      if (answer && counts.hasOwnProperty(answer)) {
        counts[answer]++;
      }
    });

    return counts;
  }
}

//Update DOM elements with vote counts
function updateQuestionResults(questionKey, counts, questionConfig) {
  questionConfig.values.forEach((value, index) => {
    const selector = questionConfig.selector.replace('{index}', index + 1);
    const element = document.querySelector(selector);

    if (element) {
      element.innerHTML = `<p>Total Votes: ${counts[value]}</p>`;
    } else {
      console.warn(`Element not found for selector: ${selector}`);
    }
  });
}


// If you want to listen for votes and update the UI
function readAllVotes() {
  onValue(votesRef, (snapshot) => {
    const votesData = snapshot.val();
    const resultsContainer = document.getElementById('results');
    console.log("All votes in database:", votesData);
      // You can process the data here and update UI elements
      // updateVotesDisplay(votesData);
      resultsContainer.hidden = false;
      resultsContainer.style.visibility="visible";
      resultsContainer.style.display="block";

      Object.entries(QUESTION_CONFIG).forEach(([questionKey, questionConfig]) => {
        const counts = countVotes(votesData, questionKey, questionConfig);
        updateQuestionResults(questionKey, counts, questionConfig);

        console.log(`${questionKey} vote counts:`, counts);
      });
  }, {
    onlyOnce: true
  });
}

// Alternative: Real-time vote counting (more efficient for live updates)
// function setupRealTimeVoting() {
//   const voteCounts = {};
  
//   // Initialize vote counts
//   Object.entries(QUESTION_CONFIG).forEach(([questionKey, questionConfig]) => {
//     voteCounts[questionKey] = {};
//     questionConfig.values.forEach(value => {
//       voteCounts[questionKey][value] = 0;
//     });
//   });
  
//   onValue(votesRef, (snapshot) => {
//     const votesData = snapshot.val();
    
//     // Reset counts
//     Object.keys(voteCounts).forEach(questionKey => {
//       Object.keys(voteCounts[questionKey]).forEach(value => {
//         voteCounts[questionKey][value] = 0;
//       });
//     });
    
//     // Recalculate counts
//     if (votesData) {
//       Object.values(votesData).forEach(vote => {
//         Object.entries(QUESTION_CONFIG).forEach(([questionKey, questionConfig]) => {
//           const answer = vote[questionKey];
//           if (answer && voteCounts[questionKey].hasOwnProperty(answer)) {
//             voteCounts[questionKey][answer]++;
//           }
//         });
//       });
//     }
    
//     // Update UI
//     Object.entries(QUESTION_CONFIG).forEach(([questionKey, questionConfig]) => {
//       updateQuestionResults(questionKey, voteCounts[questionKey], questionConfig);
//     });
    
//     console.log("Real-time vote counts:", voteCounts);
//   });
// }
