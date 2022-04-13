// =============================
// Navigation bar custom element
// =============================
class Navbar extends HTMLElement {
    constructor() {
        super();

        // Create the HTML for the element
        this.innerHTML = `
        <nav id="navbar">
            <i class="fas fa-home" id="home-i" title="Home"></i>
            <hr class="line">
            <i class="fas fa-arrow-alt-circle-left" id="back-i" title="Back"></i>
            <i class="fa-solid fa-school" id="review-i" title="Review"></i>
            <i class="far fa-lightbulb" id="quiz-i" title="Quiz"></i>
            <i class="fas fa-sign-out-alt" id="exit-i" title="Exit"></i>
        </nav>
        `;

        // Add click effects
        $("nav #home-i").click(function() {
            setTimeout(() => {window.location.href = "index.html";}, 250); 
        });
        $("nav #back-i").click(function() {
            history.back();
        });
        $("nav #quiz-i").click(function() {
            setTimeout(() => {window.location.href = "quiz.html";}, 250); 
        });
        $("nav #review-i").click(function() {
            setTimeout(() => {window.location.href = "review.html";}, 250); 
        });
    }
}
customElements.define("left-navbar", Navbar);

// =============================
// Stars custom element
// =============================
class Stars extends HTMLElement {
    constructor() {
        super();

        // Create the HTML for the element
        this.innerHTML = `
        <div id="stars-container">
            <div id="stars">
                <img src="../../assets/Stars/Silver-Star-Blank.png" id="star1" alt="First star">
            
                <img src="../../assets/Stars/Silver-Star-Blank.png" id="star2" alt="Second star">
            
                <img src="../../assets/Stars/Silver-Star-Blank.png" id="star3" alt="Third star">
            
                <img src="../../assets/Stars/Silver-Star-Blank.png" id="star4" alt="Fourth star">
            
                <img src="../../assets/Stars/Silver-Star-Blank.png" id="star5" alt="Fifth star">
                    
            </div>
        </div>
        `;
    }
}
customElements.define("stars-bar", Stars);

// =============================
// Bookmark custom element
// =============================
class Bookmark extends HTMLElement {
    constructor() {
        super();

        // Create the HTML for the element
        this.innerHTML = `
            <section class="bookmark">
                <button type="button" class="fas fa-bookmark" id="bookmark-button" title="Bookmark"></button>
                <div id="bookmark-modal-container">
                    <p class="bookmark-header">Select Bookmark</p>
                    <button type="button" id="add-bookmark">Add Page</button>
                    <div class="bookmark-list"></div>
                </div>
            </section>
        `;

        // Create a new bookmark element for a given chapter
        function appendBookmark(chapterNum, pageNum) {
            const newBookMarkDel = $(document.createElement("button"));
            const newBookMark = $(document.createElement("button"));
            
            newBookMark.html("Chapter " + chapterNum);
            newBookMark.attr("class", "newBookmark");
            newBookMark.attr("type", "button");
            newBookMark.attr("id", "ch" + chapterNum);
            
            newBookMark.click(() => {
                sessionStorage.setItem("chptNum", chapterNum);
                sessionStorage.setItem("pageNum", pageNum);
                window.location.href = "reading-page.html";
            });

            newBookMarkDel.html("x");
            newBookMarkDel.attr("type", "button");
            newBookMarkDel.attr("class", "bookmarkDel");

            // Removes the bookmark from the list of bookmarks when the X is clicked
            // (this list pervents the user from making multiple bookmarks for the same page)
            newBookMarkDel.click(() => {
                newBookMark.remove();
                newBookMarkDel.remove();
                const bookmarkList = sessionStorage.getItem("bookmarks").split(" ");
                let newBookmarkList = "";
                bookmarkList.forEach((bm) => {
                    if (!(bm === chapterNum + "-" + pageNum)) {
                        newBookmarkList += bm + " ";
                    }
                });
                sessionStorage.setItem("bookmarks", newBookmarkList);
            });

            const bookmarkModal = $(".bookmark-list");

            bookmarkModal.append(newBookMark);
            bookmarkModal.append(newBookMarkDel);
            
            const pageNumText = $(document.createElement("span"));
            pageNumText.html("Page " + pageNum);
            
            newBookMark.append(pageNumText);
        }

        // Look through the local storage to see which bookmarks
        // the user has added.
        function populateBookmarks(localBookmarks) {
            // Note: window.location.href will give you the complete url not just "index.html"
            // The - 10 comes from the fact that "index.html" is 10 characters long
            if (window.location.href.substring(window.location.href.length - 10, window.location.href.length) === "index.html") {
                $("#add-bookmark").hide();
            }

            // This should be a string of the format "1 2 3 4"
            let bookmarkList = localBookmarks.split(" ");
            bookmarkList.forEach((bm) => {
                if (bm !== null && typeof bm !== "undefined" && bm !== false && bm !== "") {
                    let chapterPage = bm.split("-");
                    appendBookmark(chapterPage[0], chapterPage[1]);
                }
            });
        }
        
        // List of chapter numbers
        populateBookmarks(sessionStorage.getItem("bookmarks"));

        function addBookmarkHelper(alreadyAdded, onReadingPage) {
            
            if (alreadyAdded === false && onReadingPage === true) {
                let currBookMarks;
                if (sessionStorage.getItem("bookmarks")) { // If there have been any bookmarks added 
                    currBookMarks = sessionStorage.getItem("bookmarks") + " " + sessionStorage.getItem("chptNum") + "-" + sessionStorage.getItem("pageNum");
                } else { // If this is the first bookmark to be added
                    currBookMarks = sessionStorage.getItem("chptNum") + "-" + sessionStorage.getItem("pageNum");
                }
                sessionStorage.setItem("bookmarks", currBookMarks);

                appendBookmark(sessionStorage.getItem("chptNum"), sessionStorage.getItem("pageNum"));
            }
        }

        // onClick effect for adding a bookmark
        const addBookmark = $("#add-bookmark");
        addBookmark.click(function() {
            let alreadyAdded = false;
            let onReadingPage = false;
            let bookmarkList = sessionStorage.getItem("bookmarks").split(" ");
            bookmarkList.forEach((bm) => {
                // Check if it is already in the list
                if (bm === sessionStorage.getItem("chptNum") + "-" + sessionStorage.getItem("pageNum")) {
                    alreadyAdded = true;
                }
            });
            if (window.location.href.substring(window.location.href.length - 17, window.location.href.length) === "reading-page.html") {
                onReadingPage = true;
            }
            setTimeout(() => {addBookmarkHelper(alreadyAdded, onReadingPage);}, 150); // Adds a delay so the button can be seen being pressed down
        });

        // Popup modal to display the bookmark
        let modal = $("#bookmark-modal-container").plainModal({ duration: 150, offset: () => {
                // Fit the position to a button.
                var btnOffset = $("#bookmark-button").offset(), win = $(window);
                return {
                    left: btnOffset.left - $("#bookmark-modal-container").width()/4,
                    top: btnOffset.top + $("#bookmark-modal-container").height()/3
                };
            } 
        });
            
        $("#bookmark-button").click(function () {
            modal = $("#bookmark-modal-container").plainModal("open");
        });
    }
}
customElements.define("book-mark", Bookmark);
