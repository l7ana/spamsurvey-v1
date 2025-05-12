
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// If you need Realtime Database:
import { getDatabase, ref, set } from 'firebase/database';
import { getAnalytics, logEvent } from 'firebase/analytics';
// ... and so on for other Firebase products you plan to use
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyB96s5Enyn4m-i5izyS6gM8yhUeRW0KJqU",
    authDomain: "sdg-spam-1.firebaseapp.com",
    projectId: "sdg-spam-1",
    storageBucket: "sdg-spam-1.firebasestorage.app",
    messagingSenderId: "439688423237",
    appId: "1:439688423237:web:2d8a1287c744e56c0dc02c",
    measurementId: "G-4K5S5TJZB3",
    databaseURL:"https://sdg-spam-1-default-rtdb.firebaseio.com/",
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Analytics
const analytics = getAnalytics(app);
logEvent(analytics, 'notification_received');

//Firebase walkthrough
function writeUserData(userID, name, email, imageUrl) {
  const db = getDatabase(app);
  const reference = ref(db, 'users/' + userID);

  set(reference, {
    username: name,
    email: email,
    profile_picture: imageUrl
  });
}

writeUserData("nameId", "name", "liana@saedesigngroup.com", "myimageurl");


// Reference porportions vote collections
var votesRef = firebase.database().ref('votes');

//Listen to form submit
document.getElementById('porportionsForm').addEventListener('submit', submitForm);

//Submit Form
function submitForm(e) {
  e.preventDefault();

  //Get values
  var option1 = getInputVal('1');
  var option2 = getInputVal('2');
  var option3 = getInputVal('3');
  var option4 = getInputVal('4');
  var option5 = getInputVal('5');

  //Save vote
  saveVote(option1, option2, option3, option4, option5);

}

// Function to get form values
function getInputVal(id){
  return document.getElementById(id).value;
}

//Save votes to firebase
function saveVote(option1, option2, option3, option4, option5){
  var newVoteRef = votesRef.push();
  newVoteRef.set({
    option1: option1, 
    option2: option2,
    option3: option3,
    option4: option4,
    option5: option5
  });
}