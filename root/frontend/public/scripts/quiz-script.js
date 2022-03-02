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

let modal = $("#modal").plainModal({ duration: 150 }); // The number refers to the time to fade in
async function defModal() {
  $("#modal-text").html("<p>Each time you answer the question correctly for a given word you gain a <span class='gold'>gold star</span>. If you get a question wrong all <span class='gold'>gold stars</span> become <span class='silver'>silver</span>. If you correctly answer the quiz for <b>this word</b> 5 times in a row you get the maximum number of stars (5).</p>");
  modal = $("#modal").plainModal("open");
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[parseInt(i, 10)];
      array[parseInt(i, 10)] = array[parseInt(j, 10)];
      array[parseInt(j, 10)] = temp;
  }
}

function quizWordsHelper(answers, word, wordSnap, blockedWords, quizzableWords) {
  wordSnap.data().derivativeWords.forEach((derivative) => {
    blockedWords.add(derivative);
  });
  while (answers.length !== 4) {
    let randomIndex = Math.floor(Math.random() * quizzableWords.length);
    if (blockedWords.has(quizzableWords[parseInt(randomIndex, 10)].id) || quizzableWords[parseInt(randomIndex, 10)].id === word) {
      continue;
    }
    answers.push(quizzableWords[parseInt(randomIndex, 10)]);
    blockedWords.add(quizzableWords[parseInt(randomIndex, 10)].id);
  }
  
  // for (let i = 0; i < 4; i++) {
  //   console.log(answers[i].data().definition);
  // }

  shuffleArray(answers);
}

async function quizWords() {
  let queue = JSON.parse(sessionStorage.getItem("queue"));
  // Codacy does not like the use of "undefined"
  if (queue === null || queue.length === 0) {
    // console.log("No words in queue!");
    $(".false").each(function() {
      $(this).html("");
    });
  } else {
    // console.log(queue);
    let word = queue[parseInt(0, 10)];
    let blockedWords = new Set();
    let wordSnap = await getDoc(doc(db, word.charAt(0), word));
    let wordQuery = query(collection(db, word.charAt(0)), where("definition", "!=", ""));
    let quizzableWords = await getDocs(wordQuery).docs;
    let answers = [wordSnap];

    quizWordsHelper(answers, word, wordSnap, blockedWords, quizzableWords);

    // console.log("\n");

    // for (let i = 0; i < 4; i++) {
    //   console.log(answers[i].data().definition);
    // }

  // wordQuerySnapshot.forEach((word) => {
  //   console.log(word.id);
  // });

    let i = 0;
    $(".false").each(function() {
      $(this).html(answers[parseInt(i, 10)].id);
      if (answers[parseInt(i, 10)].id === word) {
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
  }
}

// Does this need to be in the quizWords() function?
$("#help-btn").off("click").click(function () {
  // console.log("Clicked!");
  setTimeout(() => {defModal();}, 50);
});

quizWords();
