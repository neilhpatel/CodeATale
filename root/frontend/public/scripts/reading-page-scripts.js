let chapterStartPageNumber = [1, 7, 24, 34, 46, 58, 69, 84, 93, 102, 114, 125, 142, 150, 159, 172, 181, 192, 209, 222, 233, 239]

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
  let pagesViewed = sessionStorage.getItem(`viewedPages-ch-${chapter}`).split(" ");
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
  if (pageNum - 1 < chapterStartPageNumber[chapterNum - 1]) { // Remember: since this is indexed from 0 this is the current chapter
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

//Note: this function does throw an exception for audio of words not in database. But it does not break the application,
//it simply doesn't play audio for the word. In the future, determine if a word exists in the database before playing audio.
function playAudio(word) {
  let firstLetter = word.charAt(0).toLowerCase();
  let url = "https://words-and-definitons.s3.amazonaws.com/words/" + firstLetter + "/" + word + ".mp3";
  let audioObj = document.createElement("audio");
  audioObj.src = url;
  audioObj.play();
}

let modal = $("#modal").plainModal({duration: 150});
function defModal(word) {
  //let modWord = word.toLowerCase().replace(/[^a-z0-9’-]+/gi, ""); // Keeps all alphanumeric characters as well as the special apostrophe // Keeping this just in case we need to use the replace feature again.
  let modWord = word.toLowerCase();
  playAudio(modWord);
  modal.children("#modal-container").children("#modal-words").text(word); // I"m thinking of keeping the presented word upper case but using modWord when querying the database so it looks nicer
  modal.children("#modal-container").children("#modal-def").text("a single distinct meaningful element of speech or writing"); // Filler text
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
      
      let str = data[parseInt(chapter, 10)][parseInt(page, 10)];
      let arr = [];
      // Parses through every word to make sure only words in database get highlighted (and without grammar syntax)
      str.forEach((element) => {
        let word = [];
        let normalWord = true;
        arr.push(" ");
        for (let i = 0; i < element.length; i++) {
          if (specialSet.has(element.charAt(i))) {
            // Can"t tell between contraction and quote so this if statement checks to see which one it is
            if (element.charAt(i) === "’") {
              if ((/[a-z]/).test((element.charAt(i + 1)))) {
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
          } else { // If the letter is not a special character, it will push the letter onto the word array
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
