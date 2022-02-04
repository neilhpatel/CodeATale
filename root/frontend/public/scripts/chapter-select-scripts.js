// This code only fires once per session and is just 
// here to setup chapterNum and bookmarks in the sessionStorage.
if (!sessionStorage.getItem("firstLoad")) {
    sessionStorage.setItem("firstLoad", "1");
    sessionStorage.setItem("chptNum", "");
    sessionStorage.setItem("bookmarks", "");
    sessionStorage.setItem("pageNum", "");

    for (let i = 0; i < 21; i++) {
        sessionStorage.setItem(`viewedPages-ch-${i}`, "0");
        sessionStorage.setItem(`progress-ch-${i}`, "0");
    }
}

let chptArr = [
"Puddleby",

"Animal Language",

"More Money Troubles",

"A Message from Africa",

"The Great Journey",

"Polynesia and the King",

"The Bridge of Apes",

"The Leader of the Lions",
 
"The Monkeys' Council",

"The Rarest Animal of All",

"The Black Prince",

"Medicine and Magic",

"Red Sails and Blue Wings",

"The Rats' Warning",

"The Barbary Dragon",

"Too-Too, The Listener",

"The Ocean Gossips",

"Smells",

"The Rock",

"The Fisherman's Town",

"Home Again"
];

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

for (let i = 1; i <= 21; i++) {
    let chapterProgress = sessionStorage.getItem(`progress-ch-${i-1}`);
    
    // toFixed converts the number into one with 2 decimal places
    // but it outputs a string, so + is used to convert the string to a number
    let percentComplete = +(chapterProgress  / (chapterStartPageNumber[i] - chapterStartPageNumber[i-1])).toFixed(2);
    
    let newChapter = $(`
    <section class="chapter-box">
        <button class="chapter-button" id="${i}">${chptArr[i-1]}</button>
        <button class="img-button" id="${i}"></button>

        <p>Chapter ${i}</p>
        <div class="progress-bar">
            <div class="progress" id="chp${i}-prog" style="width: ${percentComplete*100}%"></div>
        </div>
        <p class="progress-num percent${percentComplete * 100}">${percentComplete * 100}%</p>
    </section>
    `);

    $("#selboxes").append(newChapter);
}

// Chapter Select Buttons
const chapterButtons = $(".chapter-button");


chapterButtons.each(function(i) {
    $(this).click(function() {
        let chapterNum = parseInt($(this).attr("id"), 10);
        
        sessionStorage.setItem("chptNum", chapterNum);
        sessionStorage.setItem("pageNum", chapterStartPageNumber[chapterNum - 1]); // Chapters are indexed from 0
        setTimeout(() => {window.location.href = "reading-page.html";}, 250); // Adds a delay so the button can be seen being pressed down
        
    });
});

// Chapter Image Buttons
const imgButtons = $(".img-button");

imgButtons.each(function(i) {
    $(this).click(function() {
        let chapterNum = parseInt($(this).attr("id"), 10);
        sessionStorage.setItem("chptNum", chapterNum);
        window.location.href = "gallery.html";
    });
});
