import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-analytics.js";
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js";
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
const storage = getStorage();

// This part of the code most likely needs to be changed to access the username
// of whoever is using the app. Since we are not handling login, we used a constant
// hardcoded variable to set the username instead
const username = "mtl10";

// A reference to the wordBank in the database
const wordBank = collection(db, "Users", username, "wordBank");
// A reference to the user data in the database
const userRef = doc(db, "Users", username);

// An array that contains all the start numbers
// for chapters. Needed for the reading page to flow smoothly
// from chapter to chapter
let chapterStartPageNumber = [1, 7, 24, 34, 46, 58, 69, 84, 93, 102, 114, 125, 142, 150, 159, 172, 181, 192, 209, 222, 233, 240];
// An array that contains the titles for every chapter
let chapterTitles = ["", "Puddleby", "Animal Language", "More Money Troubles", "A Message from Africa", "The Great Journey", "Polynesia and the King", "The Bridge of Apes",
  "The Leader of the Lions", "The Monkeys' Council", "The Rarest Animal of All", "The Black Prince", "Medicine and Magic", "Red Sails and Blue Wings", "The Rats' Warning",
  "The Barbary Dragon", "Too-Too, The Listener", "The Ocean Gossips", "Smells", "The Rock", "The Fisherman's Town", "Home Again"];

// Creating a list of all special characters to check for
const specialSet = new Set();
specialSet.add("\n");
specialSet.add("—");
specialSet.add(";");
specialSet.add(":");
specialSet.add("‘");
specialSet.add("’");
specialSet.add(".");
specialSet.add(",");
specialSet.add("“");
specialSet.add("”");
specialSet.add(",");
specialSet.add("!");
specialSet.add("?");

// Only called when the chapter isn't in the pagesViewed string
// and it updates the progress the user has made in the chapter
async function increaseChapterProgress(chapter) {
  let progress = chapterProgressArray[chapter];
  progress = parseInt(progress, 10);
  progress += 1;
  chapterProgressArray[chapter] = progress;
  await updateDoc(userRef, {
    chapterProgress: chapterProgressArray
  });
}

// Called every time a page is read in the reading screen
async function pageRead(chapter, page) {
  let alreadyAdded = false;
  let pagesViewed = pagesViewedArray[chapter].split(" ");
  pagesViewed.forEach((page) => {
    // Check if it is already in the list
    let currChpt = sessionStorage.getItem("chptNum"); // Chapters not indexed from 1
    let currPg = sessionStorage.getItem("pageNum");
    if (page === currChpt + "-" + currPg) {
      alreadyAdded = true;
    }
  });
  if (alreadyAdded === false) {
    let currPagesViewed;
    if (pagesViewedArray[chapter].length > 0) {
      // If there have been any pages added
      currPagesViewed =
        pagesViewedArray[chapter] +
        " " +
        chapter +
        "-" +
        page;
    } else {
      // If this is the first page to be added
      currPagesViewed = chapter + "-" + page;
    }
    pagesViewedArray[chapter] = currPagesViewed;
    // Updates the database if new pages have been viewed
    await updateDoc(userRef, {
      pagesViewed: pagesViewedArray
    });
    increaseChapterProgress(chapter);
  }
}

// Method to go to the next page
function increasePage(chapterNum, pageNum) {
  // Remember: since this is indexed from 0 this is the next chapter not the current one
  if (pageNum + 1 >= chapterStartPageNumber[parseInt(chapterNum, 10)]) {
    chapterNum++;
  }

  if (chapterNum >= 22) {
    return;
  }

  pageNum++;

  sessionStorage.setItem("chptNum", chapterNum);
  sessionStorage.setItem("pageNum", pageNum);

  // Marks that the page the user is going to is read
  pageRead(chapterNum, pageNum);
}

// Method to go to the prev page
function decreasePage(chapterNum, pageNum) {
  if (pageNum - 1 < chapterStartPageNumber[chapterNum - 1]) {
    // Remember: since this is indexed from 0 this is the current chapter
    chapterNum--;
  }

  if (chapterNum <= 0) {
    return;
  }

  pageNum--;

  sessionStorage.setItem("chptNum", chapterNum);
  sessionStorage.setItem("pageNum", pageNum);

  // Marks that the page the user is going to is read
  pageRead(chapterNum, pageNum);
}

// Function called on html load-in to set the current page and chapter
// num and to call the pageRead function
function maintainPage() {
  let pageNum = sessionStorage.getItem("pageNum");
  let chapterNum = sessionStorage.getItem("chptNum");

  // Marks that the page the user is going to is read
  pageRead(chapterNum, pageNum);
  return;
}

// Checks to see if next and prev arrow buttons should be present
function checkArrows() {
  if (sessionStorage.getItem("pageNum") <= chapterStartPageNumber[0]) {
    $("#prevPg").hide();
  } else {
    $("#prevPg").show();
  }

  if (
    sessionStorage.getItem("pageNum") >=
    chapterStartPageNumber[chapterStartPageNumber.length - 1] - 1
  ) {
    $("#nextPg").hide();
  } else {
    $("#nextPg").show();
  }
}

//Note: this function does throw an exception for audio of words not in database. But it does not break the application,
//it simply doesn't play audio for the word. In the future, determine if a word exists in the database before playing audio.
function playWordAudio(word) {
  let firstLetter = word.charAt(0).toLowerCase();
  let url = "https://brainy-literacy-assets.s3.amazonaws.com/audio/words/" + firstLetter + "/" + word + ".mp3";
  let audioObj = document.createElement("audio");
  audioObj.src = url;
  audioObj.volume = 0.5;
  audioObj.play();
}

// Updates the page audio accordingly
function updatePageAudio(pageNumber, chapterNumber) {
  $("#audio-bar")[0].pause();
  const pathReference = ref(storage, `Chapter ${chapterNumber}/Chapter${chapterNumber}_Page${pageNumber}.mp3`);
  getDownloadURL(pathReference)
  .then((url) => {
    $("#audio-bar")[0].src = url;
    $("#audio-bar").show();
  })
  .catch((error) => {
    $("#audio-bar").hide();
  });
}

// The function that handles the pop-in for the definition screen
let modal = $("#modal").plainModal({ duration: 150 });
function defModal(word, wordSnap, modWord) {
  //let modWord = word.toLowerCase().replace(/[^a-z0-9’-]+/gi, ""); // Keeps all alphanumeric characters as well as the special apostrophe // Keeping this just in case we need to use the replace feature again.
  $("#audio-bar")[0].pause();
  let definitionAudio = document.createElement("audio");
  let firstLetter = modWord.charAt(0).toUpperCase();
  // Sets the URL for the definition audio for the word
  let url = "https://brainy-literacy-assets.s3.amazonaws.com/audio/defs/" + firstLetter + "/" + modWord + "%2B.mp3";
  definitionAudio.src = url;
  definitionAudio.volume = 0.5;
  definitionAudio.play();
  $("#modal-derivative").empty();
  let length = 0;
  // Adds all derivative words to the definition screen
  wordSnap.data().derivative_words.forEach((derivative) => {
    // Need to remove the semicolon if it's the last derivative word
    length++;
    $("#modal-derivative").append(`<span class="highlight-definition">${derivative}</span>`);
    if (length !== wordSnap.data().derivative_words.length) {
      $("#modal-derivative").append("; ");
    }
  });
  $("#modal-words").text(wordSnap.data().parent_word);
  $("#modal-def").empty();
  $("#modal-def").append(`<span class="highlight-definition">${wordSnap.data().definition}</span>`);
  

  // Word audio plays if the word is clicked on in the definition screen
  $("#modal-words").off("click").click(function () {
    playWordAudio(word);
  });

  // Definition audio plays if the definition is clicked on
  $("#modal-def").off("click").click(function () {
    definitionAudio.play();
  });

  // This button adds the word to the front of the quiz queue
  // or shifts it to the front if it's already in the queue
  // and immediately goes to the quiz screen
  $("#b1").off("click").click(async function() {
    if (!queue.includes(modWord)) {
      queue.unshift(modWord);
      await updateDoc(userRef, {
        queue
      });
      window.location.href = "quiz.html";
    } else {
      queue.splice(queue.indexOf(modWord), 1);
      queue.unshift(modWord);
      // Updates the database with the updates quiz queue
      await updateDoc(userRef, {
        queue
      });
      window.location.href = "quiz.html";
    }
  });

  // Adds the word to the quiz queue.
  // If it's already in the queue, it will tell a warning.
  $("#b2").off("mousedown").mousedown(async function() {
    if (!queue.includes(modWord)) {
      queue.push(modWord);
      await updateDoc(userRef, {
        queue
      });
      if ($("#queue-msg").hasClass("queue-msg-show") === false) {
        $("#queue-msg").text("Word added to quiz queue!");
        $("#queue-msg").toggleClass("queue-msg-hide queue-msg-show");
      }
    } else {
      if ($("#queue-msg").hasClass("queue-msg-show") === false) {
        $("#queue-msg").text("You already have this word in your quiz queue!");
        $("#queue-msg").toggleClass("queue-msg-hide queue-msg-show");
      }
    }
  });
  
  $("#b2").off("mouseup").mouseup(function() {
    setTimeout(function() {
      if ($("#queue-msg").hasClass("queue-msg-show")) {
        $("#queue-msg").toggleClass("queue-msg-show queue-msg-hide");
      }
    }, 1500);
  });

  $("#modal").on("plainmodalclose", function(event) {
    definitionAudio.pause();
    $("#queue-msg").off("toggleClass").toggleClass("queue-msg-show queue-msg-hide");
  });

  $("#modal").on("plainmodalopen", function(event) {
    if ($("#queue-msg").hasClass("queue-msg-show") === true) {
      $("#queue-msg").toggleClass("queue-msg-show queue-msg-hide");
    }
  });

  modal = $("#modal").plainModal("open");
}

function updatePageText(chapter, page, modNums) {
  fetch("../../assets/json_files/parsedPages.json")
    .then((Response) => Response.json())
    .then((data) => {
      $(".main-text").empty();
      // Either increases or decreases the chapter/page numbers depending
      // on which button was pressed.
      modNums(chapter, page);

      // Checks if user is at the end or beginning of the book and removes
      // the arrows accordingly
      checkArrows();

      // Changes the page and chapter nums in system storage
      chapter = sessionStorage.getItem("chptNum");
      page = sessionStorage.getItem("pageNum");
      updatePageAudio(page, chapter);

      // Sets that chapter and page number
      $("#reading-heading").text(`Chapter ${chapter} - ${chapterTitles[parseInt(chapter, 10)]}`);
      $(".page-number").text(`Page ${page}`);

      let str = data[parseInt(chapter, 10)][parseInt(page, 10)];
      // Parses through every word to make sure only words in database get highlighted (and without grammar syntax)
      str.forEach((element) => {
        let word = [];
        let normalWord = true;
        $(".main-text").append(" ");
        for (let i = 0; i < element.length; i++) {
          if (specialSet.has(element.charAt(i))) {
            // Can"t tell between contraction and quote so this if statement checks to see which one it is
            if (element.charAt(i) === "’") {
              if (/[a-z]/.test(element.charAt(i + 1))) {
                word.push(element.charAt(i));
                normalWord = false;
                continue;
              }
            }
            // Pushes word onto the arr if the word array is filled with something
            if (word.length !== 0) {
              $(".main-text").append(`<span class="isWord">${word.join("")}</span>`);
              word = [];
            }
            // This just checks to see if a newline character exists
            if (element.charAt(i) === "\n") {
              $(".main-text").append("<br>");
            } else {
              $(".main-text").append(element.charAt(i));
            }
            normalWord = false;
          } else {
            // If the letter is not a special character, it will push the letter onto the word array
            word.push(element.charAt(i));
            // If it's at the end of the word (element), makes the word isWord only if the word is not a normal word
            if (i === element.length - 1 && normalWord === false) {
              $(".main-text").append(`<span class="isWord">${word.join("")}</span>`);
            }
          }
        }
        // If normalWord it pushes onto the arr normally with isWord class
        if (normalWord) {
          $(".main-text").append(`<span class="isWord">${word.join("")}</span>`);
        }
      });

      // Removes highlighting from word if it's not in the database and also adds click-on functionality for those words that are in the database.
      $(".isWord").each(async function () {
        // The word that has the isWord property attatched
        let word = $(this).text();
        // The word after being lowercased
        let modWord = word.toLowerCase();
        let wordDoc = doc(db, modWord.charAt(0), modWord);
        let wordSnap = await getDoc(wordDoc);
        
        // Checks to see if the word exists in the database
        if (!wordSnap.exists()) {
          $(this).removeClass("isWord");
        } else {
          // Changes modWord to the parent word of the word if it already isn't the parent word
          if (wordSnap.data().parent_word !== modWord) {
            modWord = wordSnap.data().parent_word;
            wordDoc = doc(db, modWord.charAt(0), modWord);
            wordSnap = await getDoc(wordDoc);
          }
          // Checks to see if the word has a definition.
          // Else it removes the word as having the ".isWord" class
          if (wordSnap.data().definition !== "") {
            $(this).removeClass("isWord");
            $(this).addClass("highlight");
            // Adds single click and double click event listeners
            // Single click plays audio while double click pulls open
            // the definition screen
            $(this).off().click(function(event) {
              if (event.detail === 1) {
                  let clicks = 0;
                  clicks++;
                  $(this).one("click", function() {
                      clicks++;
                  });
                  setTimeout(async function() {
                      if (clicks === 1) {
                        $("#audio-bar")[0].pause();
                        playWordAudio(modWord);
                        let wordRef = doc(wordBank, modWord);
                        let wordDoc = await getDoc(wordRef);
                        if (!wordDoc.exists()) {
                          await setDoc(doc(wordBank, modWord), {
                            definitionQueued: false, highestCorrect: 0, totalCorrect: 0,
                            totalIncorrect: 0, lastDateAccessed: "Quiz Not Taken", starNumber: 0
                          });
                        }
                        clicks = 0;
                      } else {
                        defModal(word, wordSnap, modWord);
                        let wordRef = doc(wordBank, modWord);
                        let wordDoc = await getDoc(wordRef);
                        // Sets the word in the wordBank if it doesn't exist
                        // and updates the word to have definitionQueued to be true otherwise
                        if (!wordDoc.exists()) {
                          await setDoc(doc(wordBank, modWord), {
                            definitionQueued: true, highestCorrect: 0, totalCorrect: 0,
                            totalIncorrect: 0, lastDateAccessed: "Quiz Not Taken", starNumber: 0
                          });
                        } else if (!wordDoc.data().definitionQueued) {
                          await updateDoc(doc(wordBank, modWord), {
                            definitionQueued: true
                          });
                        }
                        clicks = 0;
                      }
                  }, 400);
              }
            });
          } else {
            $(this).removeClass("isWord");
          }
        }
      });
    });
}

// Adds click event to prevPage button
const prevPage = $("#prevPg");
prevPage.click(() => {
  let chapterNum = parseInt(sessionStorage.getItem("chptNum"), 10);
  let pageNum = parseInt(sessionStorage.getItem("pageNum"), 10);

  updatePageText(chapterNum, pageNum, decreasePage);
  // $("img").attr("src", `../../assets/chapter_images/chapter${chapterNum}.png`); // Changes the chapter image
});

// Adds click event to nextPage button
const nextPage = $("#nextPg");
nextPage.click(() => {
  let chapterNum = parseInt(sessionStorage.getItem("chptNum"), 10);
  let pageNum = parseInt(sessionStorage.getItem("pageNum"), 10);
  updatePageText(chapterNum, pageNum, increasePage);
  // $("img").attr("src", `../../assets/chapter_images/chapter${num}.png`); // Changes the chapter image
});


// -------------
// --- Audio ---
// -------------
$("#audio-bar")[0].volume = 0.5;

// User data is retrieved at the end so that the rest of the script can run before it gets halted in line 452
let userDoc = await getDoc(userRef);
let queue = userDoc.data().queue;
let chapterProgressArray = userDoc.data().chapterProgress;
let pagesViewedArray = userDoc.data().pagesViewed;

// Called once everything else is done to present the reading screen
$("document").ready(function () {
  let chapterNum = parseInt(sessionStorage.getItem("chptNum"), 10);
  let pageNum = parseInt(sessionStorage.getItem("pageNum"), 10);
  // $("img").attr("src", `../../assets/chapter_images/chapter${chapterNum}.png`);
  updatePageText(chapterNum, pageNum, maintainPage);
});
