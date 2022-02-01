// This code only fires once per session and is just 
// here to setup chapterNum and bookmarks in the sessionStorage.
if (!sessionStorage.getItem("firstLoad")) {
    sessionStorage.setItem("firstLoad", "1");
    sessionStorage.setItem("chptNum", "");
    sessionStorage.setItem("bookmarks", "");
    sessionStorage.setItem("pageNum", "");
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
    8,
    31,
    46,
    61,
    77,
    91,
    111,
    124,
    134,
    150,
    165,
    186,
    196,
    209,
    224,
    236,
    250,
    271,
    287,
    300
];

for (let i = 1; i <= 21; i++) {
    let newChapter = $(`
    <section class="chapter-box">
        <button class="chapter-button" id="${i}">${chptArr[i-1]}</button>
        <button class="img-button" id="${i}"></button>

        <p>Chapter ${i}</p>
        <div class="progress-bar">
            <div class="progress" id="chp1-prog"></div>
        </div>
        <p class="progress-num">
            %35
        </p>
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
        window.location.href = "reading-page.html";
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
