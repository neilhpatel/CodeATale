import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-analytics.js";
import { getFirestore, collection, doc, getDoc, setDoc, getDocs, where, query} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
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
const analytics = getAnalytics(app);
const db = getFirestore(app);

const username = "mtl10";

let wordBankCollection = collection(db, "Users", username, "wordBank");

async function populateReviewScreen() {
  let wordBankSnapshot = await getDocs(wordBankCollection);
   let wordBank = wordBankSnapshot.docs;
   
  wordBank.forEach( (word) => {
    $(".words").append(`<li>${word.id}</li>`);
    $(".definition_queued").append(`<li>${word.data().definition_queued}</li>`);
    $(".highest_correct").append(`<li>${word.data().highest_correct}</li>`);
    $(".total_correct").append(`<li>${word.data().total_correct}</li>`);
    $(".total_incorrect").append(`<li>${word.data().total_incorrect}</li>`);
    $(".date").append(`<li>${word.data().last_date_accessed}</li>`);
  });
}

populateReviewScreen();
