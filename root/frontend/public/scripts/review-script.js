import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getFirestore, collection, getDocs} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2lfp2oGwlyluipIjXCt0ueQKXkq_UudA",
  authDomain: "junior-design-178a4.firebaseapp.com",
  databaseURL: "https://junior-design-178a4-default-rtdb.firebaseio.com",
  projectId: "junior-design-178a4",
  storageBucket: "junior-design-178a4.appspot.com",
  messagingSenderId: "503927178988",
  appId: "1:503927178988:web:343b4404b93c44c24787c9",
  measurementId: "G-SVL212L9YP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// This part of the code most likely needs to be changed to access the username
// of whoever is using the app. Since we are not handling login, we used a constant
// hardcoded variable to set the username instead
const username = "mtl10";

// A reference to the wordBank in the database
let wordBankCollection = collection(db, "Users", username, "wordBank");

// As a general side note, the .off() method exists to remove
// click methods on a text or button. It is needed or else the
// text or button in question can repeat the function twice
// potentially

// Function to populate the review screen
async function populateReviewScreen() {
  // A snapshot of the wordBank data in the database
  let wordBankSnapshot = await getDocs(wordBankCollection);
  let wordBank = wordBankSnapshot.docs;
  
  // For each word in the wordBank, will loop through
  // and add the appropriate data associated with each word to the
  // columns
  wordBank.forEach( (word) => {
    $(".words").append(`<li>${word.id}</li>`);
    $(".definitionQueued").append(`<li>${word.data().definitionQueued}</li>`);
    $(".highestCorrect").append(`<li>${word.data().highestCorrect}</li>`);
    $(".totalCorrect").append(`<li>${word.data().totalCorrect}</li>`);
    $(".totalIncorrect").append(`<li>${word.data().totalIncorrect}</li>`);
    $(".date").append(`<li>${word.data().lastDateAccessed}</li>`);
  });
}

populateReviewScreen();
