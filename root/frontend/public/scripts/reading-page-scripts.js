import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-analytics.js";
import { getFirestore, collection, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
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

// Previous testing
// let wordDoc1 = doc(db, "a", "accidents");
// let wordSnap1 = await getDoc(wordDoc1);
// console.log(wordSnap1.exists());
// console.log(wordSnap1.data().parent_word);
// let x = [];
// x.push("A");
// x.push("c");
// x.push("c");
// x.push("i");
// x.push("d");
// x.push("e");
// x.push("n");
// x.push("t");

// x[0] = x[0].toLowerCase();

// wordDoc1 = doc(db, `${x[0]}`, `${x.join("")}`);
// wordSnap1 = await getDoc(wordDoc1);
// console.log(wordSnap1.exists());
// console.log(wordSnap1.data().parent_word);

let chapterStartPageNumber = [
  1, 7, 22, 33, 42, 53, 63, 77, 87, 95, 105, 116, 132, 140, 148, 160, 168, 177,
  192, 204, 214, 220,
];

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

function increaseChapterProgress(chapter) {
  let progress = sessionStorage.getItem(`progress-ch-${chapter}`);
  progress = parseInt(progress, 10);
  progress += 1;
  sessionStorage.setItem(`progress-ch-${chapter}`, progress);
}

function pageRead(chapter, page) {
  let alreadyAdded = false;
  let pagesViewed = sessionStorage
    .getItem(`viewedPages-ch-${chapter}`)
    .split(" ");
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
    if (sessionStorage.getItem(`viewedPages-ch-${chapter}`)) {
      // If there have been any pages added
      currPagesViewed =
        sessionStorage.getItem(`viewedPages-ch-${chapter}`) +
        " " +
        chapter +
        "-" +
        page;
    } else {
      // If this is the first page to be added
      currPagesViewed = chapter + "-" + page;
    }
    sessionStorage.setItem(`viewedPages-ch-${chapter}`, currPagesViewed);

    increaseChapterProgress(chapter);
  }
}

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

function maintainPage() {
  let pageNum = sessionStorage.getItem("pageNum");
  let chapterNum = sessionStorage.getItem("chptNum");

  // Marks that the page the user is going to is read
  pageRead(chapterNum, pageNum);
  return;
}

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

let modal = $("#modal").plainModal({ duration: 150 });
async function defModal(word) {
  //let modWord = word.toLowerCase().replace(/[^a-z0-9’-]+/gi, ""); // Keeps all alphanumeric characters as well as the special apostrophe // Keeping this just in case we need to use the replace feature again.
  let modWord = word.toLowerCase();
  let wordDoc = doc(db, modWord.charAt(0), modWord);
  let wordSnap = await getDoc(wordDoc);
  // Checks to see if the word exists in the database and if there is a definition for a word
  if (!wordSnap.exists() || wordSnap.data().definition === "") {
    modal.children("#modal-container").children("#modal-words").text(word); // I"m thinking of keeping the presented word upper case but using modWord when querying the database so it looks nicer
    modal
    .children("#modal-container")
    .children("#modal-def")
    .text("There is no definition for this word."); // Filler text
    modal = $("#modal").plainModal("open");
  } else {
    // Checks if the chosen word is a derivative word and switches the query to the parent word
    if (wordSnap.data().parent_word !== modWord) {
      modWord = wordSnap.data().parent_word;
      wordDoc = doc(db, modWord.charAt(0), modWord);
      wordSnap = await getDoc(wordDoc);
    }
    modal.children("#modal-container").children("#modal-words").text(word); // I"m thinking of keeping the presented word upper case but using modWord when querying the database so it looks nicer
    modal
      .children("#modal-container")
      .children("#modal-def")
      .text(`${wordSnap.data().definition}`); // Filler text
    modal = $("#modal").plainModal("open");
  }
  
}

function updatePageText(chapter, page, modNums) {
  fetch("../../assets/json_files/parsedPages.json")
    .then((Response) => Response.json())
    .then((data) => {
      // Either increases or decreases the chapter/page numbers depending
      // on which button was pressed.
      modNums(chapter, page);

      // Checks if user is at the end or beginning of the book and removes
      // the arrows accordingly
      checkArrows();

      // Changes the page and chapter nums in system storage
      chapter = sessionStorage.getItem("chptNum");
      page = sessionStorage.getItem("pageNum");

      // Sets that chapter and page number
      $("#reading-heading").html(`Chapter ${chapter}`);
      $(".page-number").html(`Page ${page}`);

      let str = data[parseInt(chapter, 10)][parseInt(page, 10)];
      let arr = [];
      // Parses through every word to make sure only words in database get highlighted (and without grammar syntax)
      str.forEach(async (element) => {
        let word = [];
        let normalWord = true;
        arr.push(" ");
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
              
              arr.push(`<span class="highlight">${word.join("")}</span>`);
              word = [];
            }

            // This just checks to see if a newline character exists
            if (element.charAt(i) === "\n") {
              arr.push("<br>");
            } else {
              arr.push(element.charAt(i));
            }
            normalWord = false;
          } else {
            // If the letter is not a special character, it will push the letter onto the word array
            word.push(element.charAt(i));
            // If it"s at the end of the word (element), makes the word highlightable only if the word is not a normal word
            if (i === element.length - 1 && normalWord === false) {
              
              arr.push(`<span class="highlight">${word.join("")}</span>`);
            }
          }
        }
        // If normalWord it pushes onto the arr normally with highlights
        if (normalWord) {
          
          arr.push(`<span class="highlight">${word.join("")}</span>`);
          
        }
      });

      $(".main-text").html(arr);

      // Adds on click funtion for each word individually
      $(".highlight").each(function () {
        $(this).click(function () {
          defModal($(this).text());
        });
      });
    });
}

$("document").ready(function () {
  let chapterNum = parseInt(sessionStorage.getItem("chptNum"), 10);
  let pageNum = parseInt(sessionStorage.getItem("pageNum"), 10);
  // $("img").attr("src", `../../assets/chapter_images/chapter${chapterNum}.png`);
  updatePageText(chapterNum, pageNum, maintainPage);
});

const prevPage = $("#prevPg");
prevPage.click(() => {
  let chapterNum = parseInt(sessionStorage.getItem("chptNum"), 10);
  let pageNum = parseInt(sessionStorage.getItem("pageNum"), 10);

  updatePageText(chapterNum, pageNum, decreasePage);
  // $("img").attr("src", `../../assets/chapter_images/chapter${chapterNum}.png`); // Changes the chapter image
});

const nextPage = $("#nextPg");
nextPage.click(() => {
  let chapterNum = parseInt(sessionStorage.getItem("chptNum"), 10);
  let pageNum = parseInt(sessionStorage.getItem("pageNum"), 10);

  updatePageText(chapterNum, pageNum, increasePage);
  // $("img").attr("src", `../../assets/chapter_images/chapter${num}.png`); // Changes the chapter image
});
