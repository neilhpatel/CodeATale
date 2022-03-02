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



quizWords();

async function quizWords() {
  let queue = JSON.parse(sessionStorage.getItem("queue"));
  if (queue == null || queue == undefined || queue.length == 0) {
    // console.log("No words in queue!");
    $(".false").each(function() {
      $(this).html("");
    });
  } else {
    // console.log(queue);
    let queueIndex = 0;
    let word = queue[queueIndex];
    let blockedWords = new Set();
    let wordDoc = doc(db, word.charAt(0), word);
    let wordSnap = await getDoc(wordDoc);
    let wordCollection = collection(db, word.charAt(0));
    let wordQuery = query(wordCollection, where("definition", "!=", ""));
    let wordQuerySnapshot = await getDocs(wordQuery);
    let quizzableWords = wordQuerySnapshot.docs;
    let answers = [wordSnap];
    wordSnap.data().derivative_words.forEach((derivative) => {
      blockedWords.add(derivative);
    });
    while (answers.length !== 4) {
      let randomIndex = Math.floor(Math.random() * quizzableWords.length);
      if (blockedWords.has(quizzableWords[parseInt(randomIndex)].id) || quizzableWords[parseInt(randomIndex)].id === word) {
        continue;
      }
      answers.push(quizzableWords[randomIndex]);
      blockedWords.add(quizzableWords[randomIndex].id);
    }
    
    // for (let i = 0; i < 4; i++) {
    //   console.log(answers[i].data().definition);
    // }

    shuffleArray(answers);

    // console.log("\n");

    // for (let i = 0; i < 4; i++) {
    //   console.log(answers[i].data().definition);
    // }

  // wordQuerySnapshot.forEach((word) => {
  //   console.log(word.id);
  // });

    let i = 0;
    $(".false").each(function() {
      $(this).html(answers[i].id);
      if (answers[i].id === word) {
        $(this).off("click").click(function() {
          // console.log("Correct");
          queue.shift();
          sessionStorage.setItem("queue", JSON.stringify(queue));
          let audioObj = document.createElement("audio");
          audioObj.crossorigin = "anonymous";
          audioObj.src = "https://www.dropbox.com/s/dg9277bx242qlpf/correct_quiz_answer_sound.mp3?dl=0";
          audioObj.play();
          quizWords();
        });
      } else {
        $(this).off("click").click(function() {
          // console.log("Incorrect!");
        });
      }
      i++;
    });

    $("#help-btn").off("click").click(function () {
      // console.log("Clicked!");
      setTimeout(() => {defModal();}, 50);
    });
  }
}
  


let modal = $("#modal").plainModal({ duration: 150 }); // The number refers to the time to fade in
async function defModal() {
  $("#modal-text").html("<p>Each time you answer the question correctly for a given word you gain a <span class='gold'>gold star</span>. If you get a question wrong all <span class='gold'>gold stars</span> become <span class='silver'>silver</span>. If you correctly answer the quiz for <b>this word</b> 5 times in a row you get the maximum number of stars (5).</p>");
  modal = $("#modal").plainModal("open");
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}