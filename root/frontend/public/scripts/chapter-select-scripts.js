// This code only fires once per session and is just 
// here to setup chptNum and bookmarks in the sessionStorage.
if (!sessionStorage.getItem("firstLoad")) {
    sessionStorage.setItem("firstLoad", "1");
    sessionStorage.setItem("chptNum", "");
    sessionStorage.setItem("bookmarks", "");
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

for (let i = 1; i <= 21; i++) {
    let newElem = $(`
    <section class="chapter-box">
        <button type="button" class="chapter-button" id="${i}">${chptArr[i-1]}</button>
        <p>Chapter ${i}</p>
        <div class="progress-bar">
            <div class="progress" id="chp1-prog"></div>
        </div>
        <p class="progress-num">
            %35
        </p>
    </section>
    `);

    $("#selboxes").append(newElem);
}

// Chapter Select Buttons
const chapterButtons = $(".chapter-button");

chapterButtons.each(function(i) {
    $(this).click(function() {
        let chptNum = parseInt($(this).attr("id"), 10);
        sessionStorage.setItem("chptNum", chptNum);
        window.location.href = "reading-page.html";
    });
});
