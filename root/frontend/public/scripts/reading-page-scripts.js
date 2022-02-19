import { initializeApp } from 'firebase/app';
const firebaseConfig = {
  apiKey: "AIzaSyC2lfp2oGwlyluipIjXCt0ueQKXkq_UudA",
  authDomain: "junior-design-178a4.firebaseapp.com",
  databaseURL: "https://junior-design-178a4-default-rtdb.firebaseio.com",
  projectId: "junior-design-178a4",
  storageBucket: "junior-design-178a4.appspot.com",
  messagingSenderId: "503927178988",
  appId: "1:503927178988:web:343b4404b93c44c24787c9",
  measurementId: "G-SVL212L9YP"
};

const app = initializeApp(firebaseConfig);


let chapterStartPageNumber = [
  0,
  6,
  20,
  31,
  40,
  51,
  61,
  75,
  85,
  93,
  103,
  113,
  129,
  137,
  145,
  157,
  165,
  174,
  189,
  201,
  211,
  217
];

function increaseChapterProgress(chapter) {
  let progress = sessionStorage.getItem(`progress-ch-${chapter}`);
  progress = parseInt(progress, 10);
  progress += 1;
  sessionStorage.setItem(`progress-ch-${chapter}`, progress);
}

function pageRead(chapter, page) {
  chapter -= 1; // Because the chapters are not indexed from 0
  let alreadyAdded = false;
  let pagesViewed = sessionStorage.getItem(`viewedPages-ch-${chapter}`).split(" ");
  pagesViewed.forEach((page) => {
    // Check if it is already in the list
    let currChpt = sessionStorage.getItem("chptNum") - 1; // Chapters not indexed from 1
    let currPg = sessionStorage.getItem("pageNum");
    if (page === currChpt + "-" + currPg) {
      alreadyAdded = true;
    }
  });
  if (alreadyAdded === false) {
    let currPagesViewed;
    if (sessionStorage.getItem(`viewedPages-ch-${chapter}`)) { // If there have been any pages added 
      currPagesViewed = sessionStorage.getItem(`viewedPages-ch-${chapter}`) + " " + chapter + "-" + page;
    } else { // If this is the first page to be added
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
  if (pageNum - 1 < chapterStartPageNumber[chapterNum-1]) { // Remember: since this is indexed from 0 this is the current chapter
    chapterNum--;
  }

  if (chapterNum <= 0) {return;}

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

  if (sessionStorage.getItem("pageNum") >= chapterStartPageNumber[chapterStartPageNumber.length-1] - 1) {
    $("#nextPg").hide();
  } else {
    $("#nextPg").show();
  }
}

//this is where i have to edit
let modal = $("#modal").plainModal({duration: 150});
function defModal(word) {
  // modWord = word.replace(/[^A-Za-z0-9]/g, ""); // Keeps all alphanumeric characters
  modal.children("#modal-container").children("#modal-words").text(word);
  modal.children("#modal-container").children("#modal-def").text(word + " = " + "a single distinct meaningful element of speech or writing"); // Filler text
  modal = $("#modal").plainModal("open");
}

function updatePageText (chapter, page, modNums) {
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
      
      let str = data[parseInt(chapter-1, 10)][parseInt(page, 10)];
      let arr = [];
      str.forEach((element) => {
        let normalWord = true;

        if (element.indexOf("\n\n") !== -1) {
          let wordSplit = element.split("\n\n");
          arr.push(wordSplit[0] + "<br><br>");
          arr.push(wordSplit[1] + " ");
          normalWord = false;
        } 

        if (element.indexOf("—") !== -1) {
          let wordSplit = element.split("—");
          arr.push(wordSplit[0] + "—");
          arr.push(wordSplit[1] + " ");
          normalWord = false;
        } 
        
        if (normalWord) {
          arr.push(element + " ");
        }
      });

      // Could modify what is passed in as w to filter out unwanted characters.
      arr = arr.map((w) => `<span class="highlight">${w}</span>`); 

    $(".main-text").html(arr);

    // Adds on click funtion for each word individually
    $(".highlight").each(function() {
      $(this).click(function() {
        defModal($(this).text());
      });
    });
  });
}

$("document").ready(function() {
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
