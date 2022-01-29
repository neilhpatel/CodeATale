// Navigation bar custom element
class Navbar extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
        <nav id="navbar">
            <i class="fas fa-home" id="home-i"></i>
            <hr class="line">
            <i class="fas fa-arrow-alt-circle-left" id="back-i"></i>
            <i class="fas fa-brain"></i>
            <i class="far fa-lightbulb" id="quiz-i"></i>
            <i class="fas fa-sign-out-alt" id="exit-i"></i>
        </nav>
        `;
        $("nav #home-i").click(function() {
            window.location.href = "index.html";
        });
        $("nav #back-i").click(function() {
            history.back();
        });
    }
}
customElements.define("left-navbar", Navbar);

// Bookmark custom element
class Bookmark extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
            <section class="bookmark">
                <div id="overlay"></div>
                <button type="button" class="fas fa-bookmark" id="bookmark-button"></button>
                <div class="modal" id="bookmark-modal">
                    Select Bookmark
                    <button type="button" id="add-bookmark">Add Page</button>
                </div>
            </section>
        `;

        // Create a new bookmark element for a given chapter
        function appendBookmark(chapterNum, pageNum) {
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

            const bookmarkModal = $("#bookmark-modal");

            bookmarkModal.append(newBookMark);

            const pageNumText = $(document.createElement("span"));
            pageNumText.html("Page " + pageNum);
            
            newBookMark.append(pageNumText);
        }

        // Look through the local storage to see which bookmarks
        // the user has added.
        function populateBookmarks(localBookmarks) {
            // This should be a string of the format "1 2 3 4"
            let bookmarkList = localBookmarks.split(" ");
            bookmarkList.forEach((bm) => {
                if (bm !== null && typeof bm !== "undefined" && bm !== false && bm != "") {
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
            addBookmarkHelper(alreadyAdded, onReadingPage);
        });

        // Handling the modal functionality
        const openModalButton = $("#bookmark-button");

        const overlay = $("#overlay");
        const modal = $("#bookmark-modal");

        openModalButton.click(function() {
            modal.toggleClass("active");
            overlay.toggleClass("active");
        });

        overlay.click(function() {
            modal.toggleClass("active");
            overlay.toggleClass("active");
        });
    }
}
customElements.define("book-mark", Bookmark);
