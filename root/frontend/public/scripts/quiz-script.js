import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getFirestore, collection, doc, getDoc, updateDoc, getDocs, where, query, increment} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
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
// Needed to determine the date of when the quiz for words was last queued
const dateObject = new Date();
// This part of the code most likely needs to be changed to access the username
// of whoever is using the app. Since we are not handling login, we used a constant
// hardcoded variable to set the username instead
const username = "mtl10";

// As a general side note, the .off() method exists to remove
// click methods on a text or button. It is needed or else the
// text or button in question can repeat the function twice
// potentially

// A reference to the collection needed for the wordBank in the database
let wordBank = collection(db, "Users", username, "wordBank");
// A reference to the user data in the database
let userRef = doc(db, "Users", username);
let quizIndex = 0;
let ableToGoToNextPage = true;

// We need to hide the buttons immediately or there is some screen flickering on load-in
$("#prevPg").hide();
$("#nextPg").hide();

// The code that adds functionality to the quiz help button
let modal = $("#modal").plainModal({ duration: 150 }); // The number refers to the time to fade in
async function defModal() {
  $("#modal-text").empty();
  $("#modal-text").append("<p>Each time you answer the question correctly for a given word you gain a <span class='gold'>gold star</span>. If you get a question wrong all <span class='gold'>gold stars</span> become <span class='silver'>silver</span>. If you correctly answer the quiz for <b>this word</b> 5 times in a row you get the maximum number of stars (5).</p>");
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

// This function sets the buttons with the quiz answers
// and calls the shuffle arary method to mix up the answers
function setQuizAnswers(answers, word, wordSnap, blockedWords, quizzableWords) {
  // For each derivative word the word has, it will be added to
  // a Set of derivative words so that they cannot be added to the quiz
  // answer buttons
  wordSnap.data().derivative_words.forEach((derivative) => {
    blockedWords.add(derivative);
  });
  let i = 1;
  // Sets the first cell in the answer array to the correct answer
  answers[0] = wordSnap;
  // Looks for words that aren't in the blocked words Set and
  // starts with the same letter of the word being quizzed on
  while (i < 4) {
    let randomIndex = Math.floor(Math.random() * quizzableWords.length);
    if (blockedWords.has(quizzableWords[parseInt(randomIndex, 10)].id) || quizzableWords[parseInt(randomIndex, 10)].id === word) {
      continue;
    }
    answers[parseInt(i, 10)] = quizzableWords[parseInt(randomIndex, 10)];
    // adds the newly added word in the quiz answer array in the blocked words Set
    // so that multiple answers cannot be the same
    blockedWords.add(quizzableWords[parseInt(randomIndex, 10)].id);
    i++;
  }
  shuffleArray(answers);
  blockedWords.clear();
}

// Checks to see the quiz queue position to see if next or prev buttons
// should be shown
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

// Adds the appropriate amount of stars to the star counter
// on the top-right corner of the screen
function addStars(starNumber) {
  for (let i = 1; i <= starNumber; i++) {
    $("#star" + i).attr("src", "../../assets/Stars/Gold-Star-Blank.png");
  }
}

// Removes all stars in star counter
function removeStars() {
  $("img").attr("src", "../../assets/Stars/Silver-Star-Blank.png");
}

// Main function in the script that calls most of the other methods
async function quizWords() {
  checkArrows();
  if (queue === null || queue.length === 0) {
    emptyScreen();
  } else {
    // The word in question being queued
    let word = queue[parseInt(quizIndex, 10)];
    // A set of blocked words that cannot be queued
    let blockedWords = new Set();
    // A snapshot of the database data of the word being quizzed in the wordBank
    let wordSnap = await getDoc(doc(db, word.charAt(0), word));
    // A snapshot of the database data of the wordBank
    let wordBankSnap = await getDoc(doc(wordBank, word));
    // Queries for words that have a definition and start with the same letter as the word being quizzed
    let wordQuery = query(collection(db, word.charAt(0)), where("definition", "!=", ""));
    // A snapshot of the database data of the query done in the line above
    let wordQuerySnapshot = await getDocs(wordQuery);
    // quizzableWords is an array constructed from wordQuerySnapshot
    let quizzableWords = wordQuerySnapshot.docs;
    // answers is an array that will hold all quiz answers
    let answers = [];
    // starNumber holds the data for how many stars the user earned on that word
    let starNumber = wordBankSnap.data().starNumber;
    // Calculates the last date the word was quizzed
    let date = 1 + dateObject.getMonth() + "/" + dateObject.getDate() + "/" + dateObject.getFullYear();
    // Updates the database with the last date the quiz was accessed
    await updateDoc(doc(wordBank, word), {
      lastDateAccessed: date
    });
    removeStars();
    addStars(starNumber);

    $("#quiz-def").text(wordSnap.data().definition);

    // Method to set quiz answers
    setQuizAnswers(answers, word, wordSnap, blockedWords, quizzableWords);

    // Method to add functionality to all the quiz buttons
    quizHelper(answers, word, wordSnap, blockedWords, quizzableWords);
  }
}

// Method to repeat quiz when the user clicks on a quiz answer button
async function repeatQuiz(answers, word, wordSnap, blockedWords, quizzableWords) {
  // Sets the quiz answers again to the button
  setQuizAnswers(answers, word, wordSnap, blockedWords, quizzableWords);
  // Sets the quiz answer button functionality again
  quizHelper(answers, word, wordSnap, blockedWords, quizzableWords);
}

// Adds quiz button functionality
async function quizHelper(answers, word, wordSnap, blockedWords, quizzableWords) {
  let i = 0;
  // This function essentially goes through each quiz button
  // and checks to see if the button's text is the same as the
  // the word being quizzed on. If yes, the function will add
  // an event listener for clicks where it will update the database with all the 
  // information needed for the review screen assuming the user got it correct.
  // For other words, it does the same as above but updates the database with information
  // assuming the user got the quiz answer wrong.
  $(".quiz-option").each(function() {
    // Sets the quiz button text to the various words in the answer array
    $(this).html(answers[parseInt(i, 10)].id);
    // Checks to see if the word in the answer array is the correct word
    if (answers[parseInt(i, 10)].id === word) {
      // Adds a one-time click event listener
      $(this).off().one("click", async function() {
        $(".quiz-option").off();
        ableToGoToNextPage = false;
        $(this).removeClass("neutral-answer");
        $(this).addClass("correct-answer");
        let audio = new Audio("../../../backend/Audio/Sound Effects/Correct Answer - Sound Effect.wav");
        audio.volume = 0.5;
        audio.play();
        let docSnap = await getDoc(doc(wordBank, word));
        await updateDoc(doc(wordBank, word), {
          totalCorrect: increment(1)
        });
        // Doesn't increment starNumber if the user already has 4 stars and resets to zero
        if (docSnap.data().starNumber + 1 !== 5) {
          await updateDoc(doc(wordBank, word), {
            starNumber: increment(1)
          });
        } else {
          await updateDoc(doc(wordBank, word), {
            starNumber: 0
          });
        }
        // Checks to see if the user already has the highest score, doesn't incrememnt if they did
        if (docSnap.data().highestCorrect !== 5) {
          await updateDoc(doc(wordBank, word), {
            highestCorrect: increment(1)
          });
        }
        let starNumber = docSnap.data().starNumber + 1;
        addStars(starNumber);
        // if the user got 5 stars, will quickly update the database
        // with the proper starNumber information and queue information.
        // Else it repeats the quiz.
        if (starNumber === 5) { starNumber = 0; }
        setTimeout(async () => {
          $(this).removeClass("correct-answer");
          $(this).addClass("neutral-answer");
          if (starNumber === 0) {
            //console.log("Congratulations, you've mastered the word!");
            if (quizIndex === queue.length - 1) {
              quizIndex--;
            }
            queue.splice(queue.indexOf(word), 1);
            await updateDoc(userRef, {
              queue
            });
            quizWords();
          } else {
            repeatQuiz(answers, word, wordSnap, blockedWords, quizzableWords);
          }
          ableToGoToNextPage = true;
        }, 1000);
      });
    } else {
      $(this).off().one("click", async function() {
        $(".quiz-option").off();
        ableToGoToNextPage = false;
        $(this).removeClass("neutral-answer");
        $(this).addClass("incorrect-answer");
        let audio = new Audio("../../../backend/Audio/Sound Effects/Incorrect Answer - Sound Effect.wav");
        audio.volume = 0.5;
        audio.play();
        await updateDoc(doc(wordBank, word), {
          totalIncorrect: increment(1),
          starNumber: 0
        });
        removeStars();
        setTimeout(() => {
          $(this).removeClass("incorrect-answer");
          $(this).addClass("neutral-answer");
          repeatQuiz(answers, word, wordSnap, blockedWords, quizzableWords);
          ableToGoToNextPage = true;
        }, 1000);
      });
    }
    i++;
  });
}

// empties the screen of all text and functionality to prevent
// clicking after all the quizzes have been done
function emptyScreen() {
  $("#quiz-def").text("No words in queue!");
  $(".quiz-option").off().empty();
  removeStars();
}

// function to go to the prev page
$("#prevPg").off("click").click(function () {
  if (ableToGoToNextPage) {
    // code below exists to make sure the screen gets reset
    $(".quiz-option").off().empty();
    $(".quiz-option").removeClass("correct-answer");
    $(".quiz-option").removeClass("incorrect-answer");
    $(".quiz-option").addClass("neutral-answer");
    quizIndex--;
    quizWords();
  } 
});

// function to go to the next page
$("#nextPg").off("click").click(function () {
  if (ableToGoToNextPage) {
    // code below exists to make sure the screen gets reset
    $(".quiz-option").off().empty();
    $(".quiz-option").removeClass("correct-answer");
    $(".quiz-option").removeClass("incorrect-answer");
    $(".quiz-option").addClass("neutral-answer");
    quizIndex++;
    quizWords();
  }
});

// On click calls the defModal functino
$("#help-btn").off("click").click(function () {
  setTimeout(() => {defModal();}, 50);
});

// This is at the bottom so that the rest of the code can run
// before the browser hears back from the database
let userDoc = await getDoc(userRef);
let queue = userDoc.data().queue;

quizWords();
