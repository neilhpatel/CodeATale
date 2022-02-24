// Navigation bar custom element
class Navbar extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
        <nav id="navbar">
            <i class="fas fa-home" id="home-i" title="Home"></i>
            <hr class="line">
            <i class="fas fa-arrow-alt-circle-left" id="back-i" title="Back"></i>
            <i class="fa-solid fa-school" title="Review"></i>
            <i class="far fa-lightbulb" id="quiz-i" title="Quiz"></i>
            <i class="fas fa-sign-out-alt" id="exit-i" title="Exit"></i>
        </nav>
        `;
        $("nav #home-i").click(function() {
            window.location.href = "index.html";
        });
        $("nav #back-i").click(function() {
            history.back();
        });
        $("nav #quiz-i").click(function() {
            window.location.href = "quiz.html";
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
                <button type="button" class="fas fa-bookmark" id="bookmark-button" title="Bookmark"></button>
                <div id="modal1">
                    <div id="bookmark-modal">
                        Select Bookmark
                        <button type="button" id="add-bookmark">Add Page</button>
                    </div>
                </div>
            </section>
        `;

        // Create a new bookmark element for a given chapter
        function appendBookmark(chapterNum, pageNum) {
            console.log("Appending bookmark");
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

            const bookmarkModal = $("#bookmark-modal");

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
            console.log("TEST");
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
            console.log(alreadyAdded + " " + onReadingPage);
            addBookmarkHelper(alreadyAdded, onReadingPage);
        });

        // This line does not refresh when the page is resized, which causes the bookmark to be in the wrong location for that new window size
        let modal = $("#modal1").plainModal({ duration: 150, offset: {left: $(window).width() * 0.895, top: $(window).height() * 0.20}});
        $("#bookmark-button").click(function () {
            
            modal = $("#modal1").plainModal("open");
        });
    }
}
customElements.define("book-mark", Bookmark);
