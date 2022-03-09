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

let starMap = new Map(JSON.parse(sessionStorage.getItem("starMap")));
if (starMap === null) { starMap = new Map(); }
let quizIndex = 0;
let queue = JSON.parse(sessionStorage.getItem("queue"));

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

function setQuizAnswers(answers, word, wordSnap, blockedWords, quizzableWords) {
  wordSnap.data().derivative_words.forEach((derivative) => {
    blockedWords.add(derivative);
  });
  let i = 1;
  answers[0] = wordSnap;
  while (i < 4) {
    let randomIndex = Math.floor(Math.random() * quizzableWords.length);
    if (blockedWords.has(quizzableWords[parseInt(randomIndex, 10)].id) || quizzableWords[parseInt(randomIndex, 10)].id === word) {
      continue;
    }
    answers[parseInt(i, 10)] = quizzableWords[parseInt(randomIndex, 10)];
    blockedWords.add(quizzableWords[parseInt(randomIndex, 10)].id);
    i++;
  }
  shuffleArray(answers);
  blockedWords.clear();
}

function checkArrows() {
  if (quizIndex === 0) {
    $("#prevPg").hide();
  } else {
    $("#prevPg").show();
  }

  if (queue === null || quizIndex === queue.length - 1 ) {
    $("#nextPg").hide();
  } else {
    $("#nextPg").show();
  }
}

function addStars(starNumber) {
  for (let i = 1; i <= starNumber; i++) {
    $("#star" + i).attr("src", "../../assets/Stars/Gold-Star-Blank.png");
  }
}

function removeStars() {
  $("img").each(function () {
    $(this).attr("src", "../../assets/Stars/Silver-Star-Blank.png");
  });
}

function quizHelper(answers, word, wordSnap, blockedWords, quizzableWords) {
  let i = 0;
  $(".quiz-option").each(function() {
    $(this).html(answers[parseInt(i, 10)].id);
    console.log("test 1 " + answers[parseInt(i, 10)].id);
    if (answers[parseInt(i, 10)].id === word) {
      $(this).off("click").click(function() {
        $(this).css("background-color", "lime");
        new Audio("../../../backend/Audio/Sound Effects/Correct Answer - Sound Effect.wav").play();
        setTimeout(() => {
          $(this).css("background-color", "white");
          let starNumber = (starMap.has(word) ? starMap.get(word) : 0);
          starMap.set(word, starNumber + 1);
          addStars(starNumber + 1);
          
          sessionStorage.setItem("queue", JSON.stringify(queue));
          if (starNumber + 1 === 5) {
            //console.log("Congratulations, you've mastered the word!");
            if (quizIndex === queue.length - 1) {
              quizIndex--;
            }
            queue.splice(queue.indexOf(word), 1);
            starMap.set(word, 0);
            sessionStorage.setItem("starMap", JSON.stringify(Array.from(starMap)));
            quizWords();
          } else {
            sessionStorage.setItem("starMap", JSON.stringify(Array.from(starMap)));
            repeatQuiz(answers, word, wordSnap, blockedWords, quizzableWords);
          }
        }, 1000);
      });
    } else {
      $(this).off("click").click(function() {
        $(this).css("background-color", "red");
        new Audio("../../../backend/Audio/Sound Effects/Incorrect Answer - Sound Effect.wav").play();
        setTimeout(() => {
          $(this).css("background-color", "white");
          starMap.set(word, 0);
          sessionStorage.setItem("starMap", JSON.stringify(Array.from(starMap)));
          removeStars()
        }, 1000);
      });
    }
    i++;
  });
}

async function repeatQuiz(answers, word, wordSnap, blockedWords, quizzableWords) {
  setQuizAnswers(answers, word, wordSnap, blockedWords, quizzableWords);
  quizHelper(answers, word, wordSnap, blockedWords, quizzableWords);
}

function emptyScreen() {
  $("#quiz-def").text("No words in queue!");
  $(".quiz-option").each(function() {
    $(this).off().html("");
  });
  removeStars();
}

async function quizWords() {
  // Codacy does not like the use of "undefined"
  checkArrows();
  if (queue === null || queue.length === 0) {
    emptyScreen();
  } else {
    let word = queue[parseInt(quizIndex, 10)];
    let blockedWords = new Set();
    let wordSnap = await getDoc(doc(db, word.charAt(0), word));
    let wordQuery = query(collection(db, word.charAt(0)), where("definition", "!=", ""));
    let wordQuerySnapshot = await getDocs(wordQuery);
    let quizzableWords = wordQuerySnapshot.docs;
    let answers = [];
    let starNumber = (starMap.has(word) ? starMap.get(word) : 0);
    removeStars();
    addStars(starNumber);

    $("#quiz-def").text(wordSnap.data().definition);

    setQuizAnswers(answers, word, wordSnap, blockedWords, quizzableWords);

    quizHelper(answers, word, wordSnap, blockedWords, quizzableWords);
  }
}

$("#prevPg").off("click").click(function () {
  quizIndex--;
  quizWords();
});

$("#nextPg").off("click").click(function () {
  quizIndex++;
  quizWords();
});

// Does this need to be in the quizWords() function?
$("#help-btn").off("click").click(function () {
  setTimeout(() => {defModal();}, 50);
});

quizWords();
